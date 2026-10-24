<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Department;
use App\Models\AppointmentStatusHistory;
use App\Http\Requests\StoreAppointmentRequest;
use Illuminate\Support\Str;


class AppointmentController extends Controller
{
    public function create()
    {
        $departments = Department::with(['doctors' => fn($q) => $q->where('is_active', true)])
            ->where('is_active', true)
            ->get();

        return view('appointments.create', compact('departments'));
    }

    public function store(StoreAppointmentRequest $request)
    {
        $validated = $request->validated();
        $validated['reference_code'] = 'QL-' . strtoupper(Str::random(6));
        $validated['status'] = 'pending';

        $appointment = Appointment::create($validated);

        AppointmentStatusHistory::create([
            'appointment_id' => $appointment->id,
            'from_status' => null,
            'to_status' => 'pending',
            'note' => 'Janji temu baru dibuat oleh pasien.'
        ]);

        return redirect()->route('appointments.create')->with('success', 
            'Janji temu berhasil diajukan! Kode referensi Anda: ' . $appointment->reference_code
        );
    }

    public function lookup(Request $request)
    {
        $appointment = null;
        if ($request->filled(['reference_code', 'patient_phone'])) {
            $appointment = Appointment::where('reference_code', $request->reference_code)
                ->where('patient_phone', $request->patient_phone)
                ->first();
        }

        return view('appointments.status', compact('appointment'));
    }
}
