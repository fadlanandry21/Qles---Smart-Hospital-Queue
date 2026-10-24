<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\User;
use App\Models\AppointmentStatusHistory;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $penyakitDalam = Department::where('slug', 'penyakit-dalam')->first();
        $anak = Department::where('slug', 'anak')->first();

        $drAdrian = Doctor::where('slug', 'doc-1')->first();
        $drAnisa = Doctor::where('slug', 'doc-2')->first();

        $userHendra = User::where('email', 'hendra.wijaya@gmail.com')->first();

        // 1. Demo Ticket QLS-8821
        $app1 = Appointment::updateOrCreate(
            ['reference_code' => 'QLS-8821'],
            [
                'ticket_number' => 'A-027',
                'queue_number' => 'A-027',
                'user_id' => $userHendra?->id,
                'patient_name' => 'Bambang Sudarmono',
                'patient_phone' => '0812-9988-7766',
                'nik' => '3171052408900001',
                'department_id' => $penyakitDalam?->id,
                'doctor_id' => $drAdrian?->id,
                'appointment_date' => now()->toDateString(),
                'time_slot' => '10:30 - 11:00',
                'payment_method' => 'BPJS Kesehatan',
                'complaint' => 'Kontrol rutin asam lambung dan pemeriksaan enzim hati',
                'status' => 'waiting',
                'estimated_call' => '10:38 WIB',
                'people_ahead' => 2,
            ]
        );

        AppointmentStatusHistory::create([
            'appointment_id' => $app1->id,
            'from_status' => null,
            'to_status' => 'waiting',
            'note' => 'Antrean digital diterbitkan oleh sistem.',
        ]);

        // 2. Demo Ticket QLS-4412
        $app2 = Appointment::updateOrCreate(
            ['reference_code' => 'QLS-4412'],
            [
                'ticket_number' => 'B-015',
                'queue_number' => 'B-015',
                'user_id' => null,
                'patient_name' => 'Mikhaela Putri (Anak)',
                'patient_phone' => '0813-1122-3344',
                'nik' => '3172054408920003',
                'department_id' => $anak?->id,
                'doctor_id' => $drAnisa?->id,
                'appointment_date' => now()->toDateString(),
                'time_slot' => '11:00 - 11:30',
                'payment_method' => 'Asuransi Swasta / Korporasi',
                'complaint' => 'Imunisasi DPT Booster & evaluasi tumbuh kembang anak',
                'status' => 'waiting',
                'estimated_call' => '11:05 WIB',
                'people_ahead' => 2,
            ]
        );

        AppointmentStatusHistory::create([
            'appointment_id' => $app2->id,
            'from_status' => null,
            'to_status' => 'waiting',
            'note' => 'Antrean digital diterbitkan oleh sistem.',
        ]);
    }
}
