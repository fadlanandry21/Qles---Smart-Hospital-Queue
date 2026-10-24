<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentStatusHistory;
use App\Models\Department;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * List all appointments with filters
     */
    public function getTickets(Request $request): JsonResponse
    {
        $query = Appointment::with(['department', 'doctor', 'user'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('clinic_id')) {
            $query->whereHas('department', fn($q) => $q->where('slug', $request->clinic_id));
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('patient_name', 'like', "%$s%")
                  ->orWhere('reference_code', 'like', "%$s%")
                  ->orWhere('ticket_number', 'like', "%$s%")
                  ->orWhere('nik', 'like', "%$s%");
            });
        }

        $tickets = $query->get()->map(fn($t) => $this->formatTicket($t));

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    /**
     * Accept a pending ticket → waiting
     */
    public function acceptTicket(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::with(['department', 'doctor'])->findOrFail($id);

        if (!in_array($appointment->status, ['pending', 'waiting'])) {
            return response()->json(['success' => false, 'message' => 'Status tidak valid untuk diterima'], 422);
        }

        $appointment->update([
            'status' => 'waiting',
        ]);

        AppointmentStatusHistory::create([
            'appointment_id' => $appointment->id,
            'from_status' => 'pending',
            'to_status' => 'waiting',
            'note' => 'Diterima & divalidasi oleh petugas loket.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Antrean berhasil diterima',
            'data' => $this->formatTicket($appointment->fresh(['department', 'doctor'])),
        ]);
    }

    /**
     * Call patient - increment call_count (waiting/called → called)
     * Can be called multiple times before moving to serving
     */
    public function callPatient(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::with(['department', 'doctor'])->findOrFail($id);

        if (!in_array($appointment->status, ['waiting', 'called'])) {
            return response()->json(['success' => false, 'message' => 'Pasien tidak dalam antrian siap panggil'], 422);
        }

        $callTime = now()->format('H:i') . ' WIB';
        $appointment->update([
            'status' => 'called',
            'call_count' => $appointment->call_count + 1,
            'called_at' => $callTime,
        ]);

        // Update department queue display
        $dept = $appointment->department;
        if ($dept) {
            $dept->update([
                'current_number' => $appointment->ticket_number,
                'last_called_at' => $callTime,
                'total_waiting' => max(0, $dept->total_waiting - 1),
            ]);
        }

        AppointmentStatusHistory::create([
            'appointment_id' => $appointment->id,
            'from_status' => $appointment->status,
            'to_status' => 'called',
            'note' => "Panggilan ke-{$appointment->call_count}: {$callTime}",
        ]);

        // Voice announcement support (will be triggered frontend-side)
        return response()->json([
            'success' => true,
            'message' => "Nomor {$appointment->ticket_number} dipanggil (Panggilan ke-" . ($appointment->call_count + 1) . ")",
            'data' => $this->formatTicket($appointment->fresh(['department', 'doctor'])),
        ]);
    }

    /**
     * Mark as serving (called → serving)
     */
    public function servePatient(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::with(['department', 'doctor'])->findOrFail($id);

        if (!in_array($appointment->status, ['waiting', 'called'])) {
            return response()->json(['success' => false, 'message' => 'Status tidak valid untuk dilayani'], 422);
        }

        $serveTime = now()->format('H:i') . ' WIB';
        $appointment->update([
            'status' => 'serving',
            'serving_at' => $serveTime,
        ]);

        AppointmentStatusHistory::create([
            'appointment_id' => $appointment->id,
            'from_status' => 'called',
            'to_status' => 'serving',
            'note' => "Pasien masuk ruang konsultasi pukul {$serveTime}.",
        ]);

        return response()->json([
            'success' => true,
            'message' => "{$appointment->patient_name} kini sedang dilayani",
            'data' => $this->formatTicket($appointment->fresh(['department', 'doctor'])),
        ]);
    }

    /**
     * Complete consultation (serving → completed)
     */
    public function completeTicket(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::with(['department', 'doctor'])->findOrFail($id);

        if ($appointment->status !== 'serving') {
            return response()->json(['success' => false, 'message' => 'Pasien tidak sedang dilayani'], 422);
        }

        $completedTime = now()->format('H:i') . ' WIB';
        $appointment->update([
            'status' => 'completed',
            'completed_at' => $completedTime,
        ]);

        AppointmentStatusHistory::create([
            'appointment_id' => $appointment->id,
            'from_status' => 'serving',
            'to_status' => 'completed',
            'note' => "Konsultasi selesai pukul {$completedTime}.",
        ]);

        return response()->json([
            'success' => true,
            'message' => "Pelayanan {$appointment->ticket_number} ({$appointment->patient_name}) selesai",
            'data' => $this->formatTicket($appointment->fresh(['department', 'doctor'])),
        ]);
    }

    /**
     * Cancel/reject ticket
     */
    public function cancelTicket(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::with(['department', 'doctor'])->findOrFail($id);

        if (in_array($appointment->status, ['completed', 'cancelled'])) {
            return response()->json(['success' => false, 'message' => 'Tiket sudah selesai/dibatalkan'], 422);
        }

        $reason = $request->input('reason', 'Dibatalkan oleh petugas loket');
        $oldStatus = $appointment->status;
        $appointment->update([
            'status' => 'cancelled',
            'rejection_reason' => $reason,
        ]);

        // Reduce department waiting count if was waiting/called
        if (in_array($oldStatus, ['pending', 'waiting', 'called']) && $appointment->department) {
            $appointment->department->decrement('total_waiting');
        }

        AppointmentStatusHistory::create([
            'appointment_id' => $appointment->id,
            'from_status' => $oldStatus,
            'to_status' => 'cancelled',
            'note' => $reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Antrean {$appointment->ticket_number} dibatalkan",
            'data' => $this->formatTicket($appointment->fresh(['department', 'doctor'])),
        ]);
    }

    /**
     * Delete ticket permanently
     */
    public function deleteTicket(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $ticketNumber = $appointment->ticket_number;
        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => "Antrean {$ticketNumber} dihapus permanen",
        ]);
    }

    /**
     * Add a new doctor
     */
    public function addDoctor(Request $request): JsonResponse
    {
        $dept = Department::where('slug', $request->specialtyId)
            ->orWhere('name', 'like', '%' . $request->specialty . '%')
            ->first();

        if (!$dept) {
            $dept = Department::first();
        }

        $doctor = Doctor::create([
            'department_id' => $dept->id,
            'slug' => 'doc-' . time(),
            'name' => $request->name,
            'title' => $request->title,
            'specialization' => $request->specialty,
            'fee' => $request->fee ?? 'Rp 300.000',
            'clinic_room' => $request->clinicRoom ?? 'Ruang Konsultasi',
            'experience' => $request->experience ?? '5 Tahun',
            'education' => $request->education ?? 'FK Universitas Indonesia',
            'days' => $request->days ?? ['Senin', 'Rabu', 'Jumat'],
            'time_slots' => $request->timeSlots ?? [],
            'bio' => $request->bio ?? 'Dokter spesialis berpengalaman.',
            'is_active' => true,
            'rating' => 5.0,
            'reviews_count' => 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Dokter {$doctor->name} berhasil ditambahkan",
            'data' => $doctor,
        ], 201);
    }

    /**
     * Delete a doctor
     */
    public function deleteDoctor(int $id): JsonResponse
    {
        $doctor = Doctor::findOrFail($id);
        $name = $doctor->name;
        $doctor->delete();

        return response()->json([
            'success' => true,
            'message' => "Dokter {$name} berhasil dihapus",
        ]);
    }

    /**
     * Dashboard statistics
     */
    public function getStats(): JsonResponse
    {
        $today = now()->toDateString();

        $totalToday = Appointment::whereDate('created_at', $today)->count();
        $pending = Appointment::where('status', 'pending')->count();
        $waiting = Appointment::where('status', 'waiting')->orWhere('status', 'called')->count();
        $serving = Appointment::where('status', 'serving')->count();
        $completed = Appointment::whereDate('created_at', $today)->where('status', 'completed')->count();
        $totalDoctors = Doctor::where('is_active', true)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'totalToday' => $totalToday,
                'pending' => $pending,
                'waiting' => $waiting,
                'serving' => $serving,
                'completedToday' => $completed,
                'totalDoctors' => $totalDoctors,
            ],
        ]);
    }

    private function formatTicket(Appointment $app): array
    {
        return [
            'id' => $app->id,
            'bookingCode' => $app->reference_code,
            'ticketNumber' => $app->ticket_number,
            'patientName' => $app->patient_name,
            'nik' => $app->nik,
            'phone' => $app->patient_phone,
            'doctorName' => $app->doctor?->name ?: 'Dokter Poliklinik',
            'doctorId' => $app->doctor?->slug ?: ('doc-' . $app->doctor_id),
            'clinicName' => $app->department?->name ?: 'Poliklinik',
            'clinicId' => $app->department?->slug ?: 'umum',
            'room' => $app->doctor?->clinic_room ?: ($app->department?->room ?: 'Ruang Konsultasi'),
            'date' => $app->appointment_date ? Carbon::parse($app->appointment_date)->translatedFormat('d F Y') : 'Hari Ini',
            'timeSlot' => $app->time_slot,
            'estimatedCall' => $app->estimated_call ?: '10:30 WIB',
            'status' => $app->status,
            'callCount' => (int) ($app->call_count ?? 0),
            'calledAt' => $app->called_at,
            'servingAt' => $app->serving_at,
            'completedAt' => $app->completed_at,
            'peopleAhead' => (int) $app->people_ahead,
            'paymentMethod' => $app->payment_method ?: 'Umum / Mandiri',
            'notes' => $app->complaint ?: 'Pemeriksaan dan konsultasi dokter',
            'createdAt' => $app->created_at?->toISOString() ?: now()->toISOString(),
        ];
    }
}
