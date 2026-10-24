<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentStatusHistory;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AppointmentApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['department', 'doctor', 'user'])->latest();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $appointments = $query->get()->map(fn($app) => $this->formatTicket($app));

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patientName' => 'required|string|max:255',
            'phone' => 'required|string|min:8|max:20',
            'nik' => 'required|string|min:10|max:25',
            'doctorId' => 'required',
            'date' => 'required|date',
            'timeSlot' => 'required|string',
            'paymentMethod' => 'nullable|string',
            'complaint' => 'nullable|string',
        ], [
            'patientName.required' => 'Nama lengkap pasien wajib diisi',
            'phone.required' => 'Nomor telepon/WhatsApp wajib diisi',
            'nik.required' => 'NIK atau No. Rekam Medis wajib diisi',
            'doctorId.required' => 'Dokter wajib dipilih',
            'timeSlot.required' => 'Slot waktu konsultasi wajib dipilih',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Find doctor
        $doctor = Doctor::with('department')
            ->where('slug', $request->doctorId)
            ->orWhere('id', $request->doctorId)
            ->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Dokter tidak ditemukan',
            ], 404);
        }

        $department = $doctor->department ?: Department::first();

        // Start transaction
        $appointment = DB::transaction(function () use ($request, $doctor, $department) {
            // Generate random unique booking code: QLS-XXXX
            do {
                $randomCodeNum = rand(1000, 9999);
                $bookingCode = "QLS-{$randomCodeNum}";
            } while (Appointment::where('reference_code', $bookingCode)->exists());

            // Compute ticket sequence
            $prefix = $department->prefix ?: 'A';
            $currentCount = Appointment::where('department_id', $department->id)
                ->whereDate('appointment_date', $request->date)
                ->count();

            $baseSeq = 20;
            if ($department->current_number) {
                $parts = explode('-', $department->current_number);
                if (isset($parts[1])) {
                    $baseSeq = (int)$parts[1];
                }
            }

            $ticketSeq = $baseSeq + $currentCount + 1;
            $ticketNumber = sprintf('%s-%03d', $prefix, $ticketSeq);

            // Compute estimated wait time
            $waitingAhead = $department->total_waiting + 1;
            $avgMinutes = $department->avg_service_time_minutes ?: 12;
            $estMinutesWait = $waitingAhead * $avgMinutes;
            $estTime = Carbon::now()->addMinutes($estMinutesWait);
            $formattedEstTime = $estTime->format('H:i') . ' WIB';

            // Check if user is logged in
            $user = null;
            if ($request->filled('email')) {
                $user = User::where('email', $request->email)->first();
            }

            $appointment = Appointment::create([
                'reference_code' => $bookingCode,
                'ticket_number' => $ticketNumber,
                'queue_number' => $ticketNumber,
                'user_id' => $user?->id,
                'patient_name' => $request->patientName,
                'patient_phone' => $request->phone,
                'nik' => $request->nik,
                'department_id' => $department->id,
                'doctor_id' => $doctor->id,
                'appointment_date' => $request->date,
                'time_slot' => $request->timeSlot,
                'payment_method' => $request->paymentMethod ?: 'Umum / Mandiri',
                'complaint' => $request->complaint,
                'status' => 'waiting',
                'estimated_call' => $formattedEstTime,
                'people_ahead' => max(0, $waitingAhead - 1),
            ]);

            // Status history
            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'from_status' => null,
                'to_status' => 'waiting',
                'note' => 'Pendaftaran antrean digital berhasil via formulir online.',
            ]);

            // Increment department waiting count
            $department->increment('total_waiting');

            return $appointment;
        });

        $appointment->load(['department', 'doctor']);

        return response()->json([
            'success' => true,
            'message' => 'Reservasi janji temu dan nomor antrean digital berhasil dibuat',
            'data' => $this->formatTicket($appointment),
        ], 201);
    }

    public function search(Request $request): JsonResponse
    {
        $query = trim($request->get('q', ''));
        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter pencarian q diperlukan',
            ], 400);
        }

        $upper = strtoupper($query);
        $appointment = Appointment::with(['department', 'doctor'])
            ->where(DB::raw('UPPER(reference_code)'), $upper)
            ->orWhere(DB::raw('UPPER(ticket_number)'), $upper)
            ->orWhere(DB::raw('UPPER(queue_number)'), $upper)
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => "Tiket atau kode reservasi {$query} tidak ditemukan",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatTicket($appointment),
        ]);
    }

    private function formatTicket(Appointment $app): array
    {
        $maskedNik = strlen($app->nik) >= 8 
            ? substr($app->nik, 0, 4) . '********' . substr($app->nik, -4) 
            : $app->nik;

        return [
            'bookingCode' => $app->reference_code,
            'ticketNumber' => $app->ticket_number,
            'patientName' => $app->patient_name,
            'nik' => $maskedNik,
            'phone' => $app->patient_phone,
            'doctorName' => $app->doctor?->name ?: 'Dokter Poliklinik',
            'doctorId' => $app->doctor?->slug ?: ('doc-' . $app->doctor_id),
            'clinicName' => $app->department?->name ?: 'Poliklinik',
            'clinicId' => $app->department?->slug ?: 'penyakit-dalam',
            'room' => $app->doctor?->clinic_room ?: ($app->department?->room ?: 'Ruang Konsultasi Terpadu'),
            'date' => $app->appointment_date ? Carbon::parse($app->appointment_date)->translatedFormat('d F Y') : 'Hari Ini',
            'timeSlot' => $app->time_slot,
            'estimatedCall' => $app->estimated_call ?: '10:30 WIB',
            'status' => $app->status ?: 'waiting',
            'peopleAhead' => (int) $app->people_ahead,
            'paymentMethod' => $app->payment_method ?: 'Umum / Mandiri',
            'notes' => $app->complaint ?: 'Pemeriksaan dan konsultasi dokter',
            'createdAt' => $app->created_at?->toISOString() ?: now()->toISOString(),
        ];
    }
}
