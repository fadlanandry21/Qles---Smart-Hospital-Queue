<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\AppointmentStatusHistory;
use App\Http\Requests\ReviewAppointmentRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AppointmentReviewController extends Controller
{
    public function update(ReviewAppointmentRequest $request, Appointment $appointment)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $appointment) {
            $oldStatus = $appointment->status;

            if ($validated['action'] === 'confirm') {
                // Cek kuota / ketersediaan jadwal jika perlu
                $appointment->status = 'confirmed';
                $appointment->queue_number = 'A-' . rand(100, 999);
            } else {
                $appointment->status = 'rejected';
                $appointment->rejection_reason = $validated['rejection_reason'];
            }

            $appointment->admin_note = $validated['admin_note'] ?? null;
            $appointment->reviewed_by = Auth::id();
            $appointment->reviewed_at = now();
            $appointment->save();

            // Simpan history audit
            AppointmentStatusHistory::create([
                'appointment_id' => $appointment->id,
                'changed_by' => Auth::id(),
                'from_status' => $oldStatus,
                'to_status' => $appointment->status,
                'note' => $validated['action'] === 'reject' ? $validated['rejection_reason'] : 'Disetujui oleh admin'
            ]);
        });

        return back()->with('success', 'Status janji temu berhasil diperbarui!');
    }
}
