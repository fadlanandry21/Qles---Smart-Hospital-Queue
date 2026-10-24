-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 24, 2026 at 11:43 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.36

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qless`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint UNSIGNED NOT NULL,
  `reference_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `patient_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` bigint UNSIGNED NOT NULL,
  `doctor_id` bigint UNSIGNED DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `time_slot` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Umum / Mandiri',
  `complaint` text COLLATE utf8mb4_unicode_ci,
  `status` enum('waiting','called','serving','completed','cancelled','rejected','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'waiting',
  `queue_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estimated_call` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `people_ahead` int NOT NULL DEFAULT '0',
  `call_count` int UNSIGNED NOT NULL DEFAULT '0',
  `called_at` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serving_at` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completed_at` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_note` text COLLATE utf8mb4_unicode_ci,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `reference_code`, `ticket_number`, `user_id`, `patient_name`, `patient_phone`, `nik`, `department_id`, `doctor_id`, `appointment_date`, `time_slot`, `payment_method`, `complaint`, `status`, `queue_number`, `estimated_call`, `people_ahead`, `call_count`, `called_at`, `serving_at`, `completed_at`, `admin_note`, `rejection_reason`, `reviewed_by`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(1, 'QLS-8821', 'A-027', 2, 'Bambang Sudarmono', '0812-9988-7766', '3171052408900001', 1, 1, '2026-10-24', '10:30 - 11:00', 'BPJS Kesehatan', 'Kontrol rutin asam lambung dan pemeriksaan enzim hati', 'waiting', 'A-027', '10:38 WIB', 2, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(2, 'QLS-4412', 'B-015', NULL, 'Mikhaela Putri (Anak)', '0813-1122-3344', '3172054408920003', 2, 2, '2026-10-24', '11:00 - 11:30', 'Asuransi Swasta / Korporasi', 'Imunisasi DPT Booster & evaluasi tumbuh kembang anak', 'waiting', 'B-015', '11:05 WIB', 2, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-10-24 03:40:02', '2026-10-24 03:40:02');

-- --------------------------------------------------------

--
-- Table structure for table `appointment_status_histories`
--

CREATE TABLE `appointment_status_histories` (
  `id` bigint UNSIGNED NOT NULL,
  `appointment_id` bigint UNSIGNED NOT NULL,
  `changed_by` bigint UNSIGNED DEFAULT NULL,
  `from_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointment_status_histories`
--

INSERT INTO `appointment_status_histories` (`id`, `appointment_id`, `changed_by`, `from_status`, `to_status`, `note`, `created_at`) VALUES
(1, 1, NULL, NULL, 'waiting', 'Antrean digital diterbitkan oleh sistem.', '2026-10-24 10:40:02'),
(2, 2, NULL, NULL, 'waiting', 'Antrean digital diterbitkan oleh sistem.', '2026-10-24 10:40:02');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pertanyaan Jadwal Dokter',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint UNSIGNED NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `counter` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `avg_service_time_minutes` int NOT NULL DEFAULT '10',
  `current_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'A-000',
  `next_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'A-001',
  `total_waiting` int NOT NULL DEFAULT '0',
  `status` enum('serving','paused','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'serving',
  `last_called_at` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `slug`, `code`, `prefix`, `name`, `counter`, `room`, `description`, `avg_service_time_minutes`, `current_number`, `next_number`, `total_waiting`, `status`, `last_called_at`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'penyakit-dalam', 'INT', 'A', 'Poli Penyakit Dalam', 'Loket 01', 'Lantai 2, Ruang 201-206', 'Diagnosa dan penanganan menyeluruh gangguan organ dalam dewasa dan lansia.', 12, 'A-024', 'A-025', 6, 'serving', '10:14 WIB', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(2, 'anak', 'PED', 'B', 'Poli Anak & Tumbuh Kembang', 'Loket 02', 'Lantai 2, Ruang 208-212 (Kids Zone)', 'Pemeriksaan kesehatan bayi, anak, imunisasi terpadu, dan konsultasi gizi anak.', 8, 'B-012', 'B-013', 3, 'serving', '10:18 WIB', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(3, 'gigi', 'DEN', 'C', 'Poli Gigi & Mulut', 'Loket 03', 'Lantai 3, Ruang 301-304', 'Perawatan konservasi gigi, ortodonsia, pembersihan karang gigi, dan estetika senyum.', 15, 'C-008', 'C-009', 4, 'serving', '10:05 WIB', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(4, 'jantung', 'CAR', 'D', 'Poli Jantung & Pembuluh Darah', 'Loket 04', 'Lantai 3, Ruang 308-312', 'Skrining EKG, ekokardiografi, treadmill stress test, dan manajemen hipertensi.', 14, 'D-005', 'D-006', 2, 'serving', '10:10 WIB', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(5, 'mata', 'EYE', 'E', 'Poli Mata', 'Loket 05', 'Lantai 4, Ruang 401-404', 'Pemeriksaan refraksi komputer, penanganan katarak modern, dan tes tekanan bola mata.', 10, 'E-015', 'E-016', 5, 'serving', '10:16 WIB', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(6, 'saraf', 'NEU', 'G', 'Poli Saraf (Neurologi)', 'Loket 06', 'Lantai 4, Ruang 406-408', 'Konsultasi keluhan migrain, saraf terjepit, vertigo, pasca stroke, dan saraf perifer.', 13, 'G-007', 'G-008', 3, 'serving', '10:12 WIB', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(7, 'farmasi', 'FAR', 'F', 'Apotek & Pengambilan Obat', 'Loket Farmasi 1-3', 'Lantai 1, Ruang Farmasi', 'Pelayanan resep obat digital, peracikan obat, dan konsultasi apoteker klinis.', 5, 'F-102', 'F-103', 9, 'serving', '10:20 WIB', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint UNSIGNED NOT NULL,
  `department_id` bigint UNSIGNED NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(3,1) NOT NULL DEFAULT '5.0',
  `reviews_count` int UNSIGNED NOT NULL DEFAULT '0',
  `experience` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `str_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` text COLLATE utf8mb4_unicode_ci,
  `fee` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `days` json DEFAULT NULL,
  `clinic_room` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_slots` json DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `department_id`, `slug`, `name`, `title`, `specialization`, `rating`, `reviews_count`, `experience`, `education`, `str_number`, `photo`, `fee`, `days`, `clinic_room`, `time_slots`, `bio`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'doc-1', 'dr. Adrian Pratama, Sp.PD, K-GEH', 'Spesialis Penyakit Dalam - Konsultan Gastroenterohepatologi', 'Penyakit Dalam', '4.9', 142, '14 Tahun', 'Spesialis Penyakit Dalam FK UI & Fellow Gastroenterologi Tokyo University', 'STR-31.1.1.100.2.19.08456', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80', 'Rp 350.000', '[\"Senin\", \"Rabu\", \"Jumat\"]', 'Ruang 202, Lantai 2', '[{\"time\": \"08:30 - 09:00\", \"available\": true, \"quotaRemaining\": 3}, {\"time\": \"09:00 - 09:30\", \"available\": true, \"quotaRemaining\": 2}, {\"time\": \"09:30 - 10:00\", \"available\": false, \"quotaRemaining\": 0}, {\"time\": \"10:30 - 11:00\", \"available\": true, \"quotaRemaining\": 1}, {\"time\": \"13:30 - 14:00\", \"available\": true, \"quotaRemaining\": 4}, {\"time\": \"14:00 - 14:30\", \"available\": true, \"quotaRemaining\": 2}]', 'Berpengalaman menangani gangguan saluran cerna kompleks, lambung, hati, serta manajemen penyakit metabolik kronis secara komprehensif.', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(2, 2, 'doc-2', 'dr. Anisa Larasati, Sp.A, M.Biomed', 'Spesialis Anak & Tumbuh Kembang', 'Poli Anak', '5.0', 215, '11 Tahun', 'Dokter Spesialis Anak FK Unair & Magister Biomedis', 'STR-31.1.2.100.1.21.12903', 'https://images.unsplash.com/photo-1594824813580-2a813898124b?w=500&auto=format&fit=crop&q=80', 'Rp 300.000', '[\"Senin\", \"Selasa\", \"Kamis\", \"Sabtu\"]', 'Ruang 209 (Kids Corner), Lantai 2', '[{\"time\": \"08:00 - 08:30\", \"available\": true, \"quotaRemaining\": 2}, {\"time\": \"08:30 - 09:00\", \"available\": true, \"quotaRemaining\": 3}, {\"time\": \"09:00 - 09:30\", \"available\": true, \"quotaRemaining\": 1}, {\"time\": \"10:00 - 10:30\", \"available\": false, \"quotaRemaining\": 0}, {\"time\": \"11:00 - 11:30\", \"available\": true, \"quotaRemaining\": 4}]', 'Ramah anak, mengutamakan pendekatan minim trauma dalam pemeriksaan kesehatan balita, imunisasi lengkap, dan stimulasi motorik.', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(3, 3, 'doc-3', 'drg. Rayhan Wirawan, Sp.KG', 'Spesialis Konservasi Gigi & Estetika', 'Poli Gigi & Mulut', '4.8', 98, '9 Tahun', 'Spesialis Konservasi Gigi FKG UGM', 'STR-32.2.1.200.3.22.09121', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80', 'Rp 275.000', '[\"Selasa\", \"Kamis\", \"Jumat\"]', 'Ruang 302, Lantai 3', '[{\"time\": \"09:00 - 09:30\", \"available\": true, \"quotaRemaining\": 2}, {\"time\": \"10:00 - 10:30\", \"available\": true, \"quotaRemaining\": 1}, {\"time\": \"13:00 - 13:30\", \"available\": false, \"quotaRemaining\": 0}, {\"time\": \"14:00 - 14:30\", \"available\": true, \"quotaRemaining\": 3}]', 'Ahli restorasi gigi estetik, perawatan saluran akar mikro, veneer, dan pembersihan karang gigi ultrasonik bebas ngilu.', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(4, 4, 'doc-4', 'dr. Farhan Baskoro, Sp.JP(K), FIHA', 'Spesialis Jantung & Pembuluh Darah (Intervensi)', 'Poli Jantung', '4.9', 167, '16 Tahun', 'Spesialis Kardiologi FK UI & Fellow Intervensi Jantung National Heart Center Singapore', 'STR-31.1.1.100.4.17.06782', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80', 'Rp 400.000', '[\"Senin\", \"Rabu\", \"Kamis\", \"Sabtu\"]', 'Ruang 310, Lantai 3', '[{\"time\": \"08:30 - 09:00\", \"available\": true, \"quotaRemaining\": 2}, {\"time\": \"09:30 - 10:00\", \"available\": true, \"quotaRemaining\": 1}, {\"time\": \"10:30 - 11:00\", \"available\": false, \"quotaRemaining\": 0}, {\"time\": \"14:30 - 15:00\", \"available\": true, \"quotaRemaining\": 2}, {\"time\": \"15:30 - 16:00\", \"available\": true, \"quotaRemaining\": 3}]', 'Fokus pada skrining jantung preventif, deteksi dini penyumbatan koroner, rehabilitasi jantung, dan kontrol tekanan darah.', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(5, 5, 'doc-5', 'dr. Nadia Kusuma, Sp.M', 'Spesialis Mata (Ophthalmology)', 'Poli Mata', '4.9', 110, '8 Tahun', 'Dokter Spesialis Mata FK Padjadjaran & LASIK Certification', 'STR-31.1.2.300.2.23.04412', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80', 'Rp 300.000', '[\"Selasa\", \"Rabu\", \"Sabtu\"]', 'Ruang 403, Lantai 4', '[{\"time\": \"09:00 - 09:30\", \"available\": true, \"quotaRemaining\": 2}, {\"time\": \"10:00 - 10:30\", \"available\": true, \"quotaRemaining\": 3}, {\"time\": \"11:00 - 11:30\", \"available\": false, \"quotaRemaining\": 0}, {\"time\": \"13:30 - 14:00\", \"available\": true, \"quotaRemaining\": 2}]', 'Menangani gangguan refraksi mata, katarak fakoemulsifikasi, dry eye syndrome, dan pemeriksaan retina digital beresolusi tinggi.', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02'),
(6, 6, 'doc-6', 'dr. Dimas Setiawan, Sp.N', 'Spesialis Neurologi / Saraf', 'Poli Saraf', '4.8', 88, '12 Tahun', 'Spesialis Saraf FK Diponegoro & Neurofisiologi Klinis', 'STR-33.1.1.400.1.20.15523', 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&auto=format&fit=crop&q=80', 'Rp 320.000', '[\"Senin\", \"Selasa\", \"Jumat\"]', 'Ruang 407, Lantai 4', '[{\"time\": \"08:30 - 09:00\", \"available\": true, \"quotaRemaining\": 3}, {\"time\": \"09:30 - 10:00\", \"available\": true, \"quotaRemaining\": 1}, {\"time\": \"13:00 - 13:30\", \"available\": true, \"quotaRemaining\": 2}, {\"time\": \"14:00 - 14:30\", \"available\": false, \"quotaRemaining\": 0}]', 'Berfokus pada terapi vertigo, nyeri kepala kronis, saraf kejepit (HNP) dengan pendekatan non-bedah modern, dan pemulihan stroke.', 1, '2026-10-24 03:40:02', '2026-10-24 03:40:02');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_10_23_000001_create_departments_table', 1),
(5, '2026_10_23_000002_create_doctors_table', 1),
(6, '2026_10_23_000003_create_appointments_table', 1),
(7, '2026_10_23_000004_create_appointment_status_histories_table', 1),
(8, '2026_10_23_000005_create_contact_messages_table', 1),
(9, '2026_10_23_194246_update_users_and_appointments_tables', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nik` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `role` enum('patient','doctor','staff','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'patient',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `nik`, `address`, `gender`, `birth_date`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator RS Qless', 'admin@mail.com', '0811-9876-5432', '3171010101900001', 'Jl. Kesehatan Medika No. 12, Jakarta', 'Laki-laki', '1988-05-15', 'admin', NULL, '$2y$12$LbEPwhZdBFvSd58Pp7EywOKzQllzz63gpLIy6oyZmVUgu0riVlKWi', NULL, '2026-10-24 03:40:01', '2026-10-24 03:40:01'),
(2, 'Hendra Wijaya', 'hendra.wijaya@gmail.com', '0812-8877-6655', '3171052408900002', 'Jl. Tebet Barat Raya No. 45, Jakarta Selatan', 'Laki-laki', '1990-08-24', 'patient', NULL, '$2y$12$RzTbobwMuH2SR6cY/edvXOVI.bkE9T79X7uvsF/nU8HgkGT5lkJbe', NULL, '2026-10-24 03:40:01', '2026-10-24 03:40:01'),
(3, 'Siti Rahmawati', 'siti.rahmawati@gmail.com', '0813-1122-3344', '3172054408920003', 'Jl. Kemang Timur No. 8, Jakarta Selatan', 'Perempuan', '1992-04-18', 'patient', NULL, '$2y$12$4ojT3MwaVAE9OEhurgB9n.dNkiYS6IDcyZHLX3zVPUrS6IdwBbWEO', NULL, '2026-10-24 03:40:02', '2026-10-24 03:40:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointments_reference_code_unique` (`reference_code`),
  ADD KEY `appointments_user_id_foreign` (`user_id`),
  ADD KEY `appointments_department_id_foreign` (`department_id`),
  ADD KEY `appointments_doctor_id_foreign` (`doctor_id`),
  ADD KEY `appointments_reviewed_by_foreign` (`reviewed_by`);

--
-- Indexes for table `appointment_status_histories`
--
ALTER TABLE `appointment_status_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_status_histories_appointment_id_foreign` (`appointment_id`),
  ADD KEY `appointment_status_histories_changed_by_foreign` (`changed_by`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_slug_unique` (`slug`),
  ADD UNIQUE KEY `departments_code_unique` (`code`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doctors_slug_unique` (`slug`),
  ADD KEY `doctors_department_id_foreign` (`department_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `appointment_status_histories`
--
ALTER TABLE `appointment_status_histories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `appointment_status_histories`
--
ALTER TABLE `appointment_status_histories`
  ADD CONSTRAINT `appointment_status_histories_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointment_status_histories_changed_by_foreign` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
