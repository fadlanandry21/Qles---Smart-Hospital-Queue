<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin specified by user: admin@mail.com / admin123
        User::updateOrCreate(
            ['email' => 'admin@mail.com'],
            [
                'name' => 'Administrator RS Qless',
                'phone' => '0811-9876-5432',
                'nik' => '3171010101900001',
                'role' => 'admin',
                'address' => 'Jl. Kesehatan Medika No. 12, Jakarta',
                'gender' => 'Laki-laki',
                'birth_date' => '1988-05-15',
                'password' => Hash::make('admin123'),
            ]
        );

        // Demo Patient
        User::updateOrCreate(
            ['email' => 'hendra.wijaya@gmail.com'],
            [
                'name' => 'Hendra Wijaya',
                'phone' => '0812-8877-6655',
                'nik' => '3171052408900002',
                'role' => 'patient',
                'address' => 'Jl. Tebet Barat Raya No. 45, Jakarta Selatan',
                'gender' => 'Laki-laki',
                'birth_date' => '1990-08-24',
                'password' => Hash::make('hendra123'),
            ]
        );

        // Additional demo patient
        User::updateOrCreate(
            ['email' => 'siti.rahmawati@gmail.com'],
            [
                'name' => 'Siti Rahmawati',
                'phone' => '0813-1122-3344',
                'nik' => '3172054408920003',
                'role' => 'patient',
                'address' => 'Jl. Kemang Timur No. 8, Jakarta Selatan',
                'gender' => 'Perempuan',
                'birth_date' => '1992-04-18',
                'password' => Hash::make('siti123'),
            ]
        );
    }
}
