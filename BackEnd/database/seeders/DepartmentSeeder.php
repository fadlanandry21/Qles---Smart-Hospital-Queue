<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'slug' => 'penyakit-dalam',
                'code' => 'INT',
                'prefix' => 'A',
                'name' => 'Poli Penyakit Dalam',
                'counter' => 'Loket 01',
                'room' => 'Lantai 2, Ruang 201-206',
                'description' => 'Diagnosa dan penanganan menyeluruh gangguan organ dalam dewasa dan lansia.',
                'avg_service_time_minutes' => 12,
                'current_number' => 'A-024',
                'next_number' => 'A-025',
                'total_waiting' => 6,
                'status' => 'serving',
                'last_called_at' => '10:14 WIB',
                'is_active' => true,
            ],
            [
                'slug' => 'anak',
                'code' => 'PED',
                'prefix' => 'B',
                'name' => 'Poli Anak & Tumbuh Kembang',
                'counter' => 'Loket 02',
                'room' => 'Lantai 2, Ruang 208-212 (Kids Zone)',
                'description' => 'Pemeriksaan kesehatan bayi, anak, imunisasi terpadu, dan konsultasi gizi anak.',
                'avg_service_time_minutes' => 8,
                'current_number' => 'B-012',
                'next_number' => 'B-013',
                'total_waiting' => 3,
                'status' => 'serving',
                'last_called_at' => '10:18 WIB',
                'is_active' => true,
            ],
            [
                'slug' => 'gigi',
                'code' => 'DEN',
                'prefix' => 'C',
                'name' => 'Poli Gigi & Mulut',
                'counter' => 'Loket 03',
                'room' => 'Lantai 3, Ruang 301-304',
                'description' => 'Perawatan konservasi gigi, ortodonsia, pembersihan karang gigi, dan estetika senyum.',
                'avg_service_time_minutes' => 15,
                'current_number' => 'C-008',
                'next_number' => 'C-009',
                'total_waiting' => 4,
                'status' => 'serving',
                'last_called_at' => '10:05 WIB',
                'is_active' => true,
            ],
            [
                'slug' => 'jantung',
                'code' => 'CAR',
                'prefix' => 'D',
                'name' => 'Poli Jantung & Pembuluh Darah',
                'counter' => 'Loket 04',
                'room' => 'Lantai 3, Ruang 308-312',
                'description' => 'Skrining EKG, ekokardiografi, treadmill stress test, dan manajemen hipertensi.',
                'avg_service_time_minutes' => 14,
                'current_number' => 'D-005',
                'next_number' => 'D-006',
                'total_waiting' => 2,
                'status' => 'serving',
                'last_called_at' => '10:10 WIB',
                'is_active' => true,
            ],
            [
                'slug' => 'mata',
                'code' => 'EYE',
                'prefix' => 'E',
                'name' => 'Poli Mata',
                'counter' => 'Loket 05',
                'room' => 'Lantai 4, Ruang 401-404',
                'description' => 'Pemeriksaan refraksi komputer, penanganan katarak modern, dan tes tekanan bola mata.',
                'avg_service_time_minutes' => 10,
                'current_number' => 'E-015',
                'next_number' => 'E-016',
                'total_waiting' => 5,
                'status' => 'serving',
                'last_called_at' => '10:16 WIB',
                'is_active' => true,
            ],
            [
                'slug' => 'saraf',
                'code' => 'NEU',
                'prefix' => 'G',
                'name' => 'Poli Saraf (Neurologi)',
                'counter' => 'Loket 06',
                'room' => 'Lantai 4, Ruang 406-408',
                'description' => 'Konsultasi keluhan migrain, saraf terjepit, vertigo, pasca stroke, dan saraf perifer.',
                'avg_service_time_minutes' => 13,
                'current_number' => 'G-007',
                'next_number' => 'G-008',
                'total_waiting' => 3,
                'status' => 'serving',
                'last_called_at' => '10:12 WIB',
                'is_active' => true,
            ],
            [
                'slug' => 'farmasi',
                'code' => 'FAR',
                'prefix' => 'F',
                'name' => 'Apotek & Pengambilan Obat',
                'counter' => 'Loket Farmasi 1-3',
                'room' => 'Lantai 1, Ruang Farmasi',
                'description' => 'Pelayanan resep obat digital, peracikan obat, dan konsultasi apoteker klinis.',
                'avg_service_time_minutes' => 5,
                'current_number' => 'F-102',
                'next_number' => 'F-103',
                'total_waiting' => 9,
                'status' => 'serving',
                'last_called_at' => '10:20 WIB',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(['slug' => $dept['slug']], $dept);
        }
    }
}
