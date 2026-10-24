<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\Department;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $penyakitDalam = Department::where('slug', 'penyakit-dalam')->first();
        $anak = Department::where('slug', 'anak')->first();
        $gigi = Department::where('slug', 'gigi')->first();
        $jantung = Department::where('slug', 'jantung')->first();
        $mata = Department::where('slug', 'mata')->first();
        $saraf = Department::where('slug', 'saraf')->first();

        $doctors = [
            [
                'slug' => 'doc-1',
                'department_id' => $penyakitDalam?->id,
                'name' => 'dr. Adrian Pratama, Sp.PD, K-GEH',
                'title' => 'Spesialis Penyakit Dalam - Konsultan Gastroenterohepatologi',
                'specialization' => 'Penyakit Dalam',
                'rating' => 4.9,
                'reviews_count' => 142,
                'experience' => '14 Tahun',
                'education' => 'Spesialis Penyakit Dalam FK UI & Fellow Gastroenterologi Tokyo University',
                'str_number' => 'STR-31.1.1.100.2.19.08456',
                'photo' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
                'fee' => 'Rp 350.000',
                'days' => ['Senin', 'Rabu', 'Jumat'],
                'clinic_room' => 'Ruang 202, Lantai 2',
                'time_slots' => [
                    ['time' => '08:30 - 09:00', 'available' => true, 'quotaRemaining' => 3],
                    ['time' => '09:00 - 09:30', 'available' => true, 'quotaRemaining' => 2],
                    ['time' => '09:30 - 10:00', 'available' => false, 'quotaRemaining' => 0],
                    ['time' => '10:30 - 11:00', 'available' => true, 'quotaRemaining' => 1],
                    ['time' => '13:30 - 14:00', 'available' => true, 'quotaRemaining' => 4],
                    ['time' => '14:00 - 14:30', 'available' => true, 'quotaRemaining' => 2],
                ],
                'bio' => 'Berpengalaman menangani gangguan saluran cerna kompleks, lambung, hati, serta manajemen penyakit metabolik kronis secara komprehensif.',
                'is_active' => true,
            ],
            [
                'slug' => 'doc-2',
                'department_id' => $anak?->id,
                'name' => 'dr. Anisa Larasati, Sp.A, M.Biomed',
                'title' => 'Spesialis Anak & Tumbuh Kembang',
                'specialization' => 'Poli Anak',
                'rating' => 5.0,
                'reviews_count' => 215,
                'experience' => '11 Tahun',
                'education' => 'Dokter Spesialis Anak FK Unair & Magister Biomedis',
                'str_number' => 'STR-31.1.2.100.1.21.12903',
                'photo' => 'https://images.unsplash.com/photo-1594824813580-2a813898124b?w=500&auto=format&fit=crop&q=80',
                'fee' => 'Rp 300.000',
                'days' => ['Senin', 'Selasa', 'Kamis', 'Sabtu'],
                'clinic_room' => 'Ruang 209 (Kids Corner), Lantai 2',
                'time_slots' => [
                    ['time' => '08:00 - 08:30', 'available' => true, 'quotaRemaining' => 2],
                    ['time' => '08:30 - 09:00', 'available' => true, 'quotaRemaining' => 3],
                    ['time' => '09:00 - 09:30', 'available' => true, 'quotaRemaining' => 1],
                    ['time' => '10:00 - 10:30', 'available' => false, 'quotaRemaining' => 0],
                    ['time' => '11:00 - 11:30', 'available' => true, 'quotaRemaining' => 4],
                ],
                'bio' => 'Ramah anak, mengutamakan pendekatan minim trauma dalam pemeriksaan kesehatan balita, imunisasi lengkap, dan stimulasi motorik.',
                'is_active' => true,
            ],
            [
                'slug' => 'doc-3',
                'department_id' => $gigi?->id,
                'name' => 'drg. Rayhan Wirawan, Sp.KG',
                'title' => 'Spesialis Konservasi Gigi & Estetika',
                'specialization' => 'Poli Gigi & Mulut',
                'rating' => 4.8,
                'reviews_count' => 98,
                'experience' => '9 Tahun',
                'education' => 'Spesialis Konservasi Gigi FKG UGM',
                'str_number' => 'STR-32.2.1.200.3.22.09121',
                'photo' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
                'fee' => 'Rp 275.000',
                'days' => ['Selasa', 'Kamis', 'Jumat'],
                'clinic_room' => 'Ruang 302, Lantai 3',
                'time_slots' => [
                    ['time' => '09:00 - 09:30', 'available' => true, 'quotaRemaining' => 2],
                    ['time' => '10:00 - 10:30', 'available' => true, 'quotaRemaining' => 1],
                    ['time' => '13:00 - 13:30', 'available' => false, 'quotaRemaining' => 0],
                    ['time' => '14:00 - 14:30', 'available' => true, 'quotaRemaining' => 3],
                ],
                'bio' => 'Ahli restorasi gigi estetik, perawatan saluran akar mikro, veneer, dan pembersihan karang gigi ultrasonik bebas ngilu.',
                'is_active' => true,
            ],
            [
                'slug' => 'doc-4',
                'department_id' => $jantung?->id,
                'name' => 'dr. Farhan Baskoro, Sp.JP(K), FIHA',
                'title' => 'Spesialis Jantung & Pembuluh Darah (Intervensi)',
                'specialization' => 'Poli Jantung',
                'rating' => 4.9,
                'reviews_count' => 167,
                'experience' => '16 Tahun',
                'education' => 'Spesialis Kardiologi FK UI & Fellow Intervensi Jantung National Heart Center Singapore',
                'str_number' => 'STR-31.1.1.100.4.17.06782',
                'photo' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80',
                'fee' => 'Rp 400.000',
                'days' => ['Senin', 'Rabu', 'Kamis', 'Sabtu'],
                'clinic_room' => 'Ruang 310, Lantai 3',
                'time_slots' => [
                    ['time' => '08:30 - 09:00', 'available' => true, 'quotaRemaining' => 2],
                    ['time' => '09:30 - 10:00', 'available' => true, 'quotaRemaining' => 1],
                    ['time' => '10:30 - 11:00', 'available' => false, 'quotaRemaining' => 0],
                    ['time' => '14:30 - 15:00', 'available' => true, 'quotaRemaining' => 2],
                    ['time' => '15:30 - 16:00', 'available' => true, 'quotaRemaining' => 3],
                ],
                'bio' => 'Fokus pada skrining jantung preventif, deteksi dini penyumbatan koroner, rehabilitasi jantung, dan kontrol tekanan darah.',
                'is_active' => true,
            ],
            [
                'slug' => 'doc-5',
                'department_id' => $mata?->id,
                'name' => 'dr. Nadia Kusuma, Sp.M',
                'title' => 'Spesialis Mata (Ophthalmology)',
                'specialization' => 'Poli Mata',
                'rating' => 4.9,
                'reviews_count' => 110,
                'experience' => '8 Tahun',
                'education' => 'Dokter Spesialis Mata FK Padjadjaran & LASIK Certification',
                'str_number' => 'STR-31.1.2.300.2.23.04412',
                'photo' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
                'fee' => 'Rp 300.000',
                'days' => ['Selasa', 'Rabu', 'Sabtu'],
                'clinic_room' => 'Ruang 403, Lantai 4',
                'time_slots' => [
                    ['time' => '09:00 - 09:30', 'available' => true, 'quotaRemaining' => 2],
                    ['time' => '10:00 - 10:30', 'available' => true, 'quotaRemaining' => 3],
                    ['time' => '11:00 - 11:30', 'available' => false, 'quotaRemaining' => 0],
                    ['time' => '13:30 - 14:00', 'available' => true, 'quotaRemaining' => 2],
                ],
                'bio' => 'Menangani gangguan refraksi mata, katarak fakoemulsifikasi, dry eye syndrome, dan pemeriksaan retina digital beresolusi tinggi.',
                'is_active' => true,
            ],
            [
                'slug' => 'doc-6',
                'department_id' => $saraf?->id,
                'name' => 'dr. Dimas Setiawan, Sp.N',
                'title' => 'Spesialis Neurologi / Saraf',
                'specialization' => 'Poli Saraf',
                'rating' => 4.8,
                'reviews_count' => 88,
                'experience' => '12 Tahun',
                'education' => 'Spesialis Saraf FK Diponegoro & Neurofisiologi Klinis',
                'str_number' => 'STR-33.1.1.400.1.20.15523',
                'photo' => 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&auto=format&fit=crop&q=80',
                'fee' => 'Rp 320.000',
                'days' => ['Senin', 'Selasa', 'Jumat'],
                'clinic_room' => 'Ruang 407, Lantai 4',
                'time_slots' => [
                    ['time' => '08:30 - 09:00', 'available' => true, 'quotaRemaining' => 3],
                    ['time' => '09:30 - 10:00', 'available' => true, 'quotaRemaining' => 1],
                    ['time' => '13:00 - 13:30', 'available' => true, 'quotaRemaining' => 2],
                    ['time' => '14:00 - 14:30', 'available' => false, 'quotaRemaining' => 0],
                ],
                'bio' => 'Berfokus pada terapi vertigo, nyeri kepala kronis, saraf kejepit (HNP) dengan pendekatan non-bedah modern, dan pemulihan stroke.',
                'is_active' => true,
            ],
        ];

        foreach ($doctors as $doc) {
            Doctor::updateOrCreate(['slug' => $doc['slug']], $doc);
        }
    }
}
