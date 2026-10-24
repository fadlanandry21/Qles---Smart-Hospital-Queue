# 📋 Qless Medika — REST API Documentation

> **Version:** 1.0.0  
> **Base URL (Development):** `http://localhost:8000/api`  
> **Base URL (Production):** `https://api.qlessmedika.co.id/api`  
> **Backend:** Laravel 11 + Laravel Sanctum  
> **Content-Type:** `application/json`  
> **Authentication:** Bearer Token (Sanctum)

---

## 📑 Daftar Isi

1. [Konvensi Response](#konvensi-response)
2. [Authentication](#1-authentication)
3. [Pasien (User)](#2-pasien-user)
4. [Dokter](#3-dokter)
5. [Spesialisasi / Klinik](#4-spesialisasi--klinik)
6. [Appointment / Reservasi](#5-appointment--reservasi)
7. [Queue / Antrean](#6-queue--antrean)
8. [Admin — Queue Management](#7-admin--queue-management)
9. [Admin — Dashboard Stats](#8-admin--dashboard-stats)
10. [Error Codes](#error-codes)
11. [Database Schema](#database-schema)

---

## Konvensi Response

Semua endpoint mengembalikan struktur JSON yang konsisten:

### ✅ Success Response
```json
{
  "success": true,
  "message": "Deskripsi singkat hasil operasi",
  "data": { ... },
  "meta": {
    "current_page": 1,
    "total": 50,
    "per_page": 15
  }
}
```

### ❌ Error Response
```json
{
  "success": false,
  "message": "Deskripsi error",
  "errors": {
    "field_name": ["Pesan validasi error"]
  },
  "error_code": "VALIDATION_FAILED"
}
```

---

## 1. Authentication

### `POST /auth/register`
Registrasi pasien baru.

**Request Body:**
```json
{
  "name": "Siti Rahmawati",
  "email": "siti@email.com",
  "phone": "081298887711",
  "nik": "3171058291020003",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Validasi:**
| Field | Aturan |
|---|---|
| `name` | required, string, max:100 |
| `email` | required, email, unique:users |
| `phone` | required, string, min:10, max:15 |
| `nik` | required, digits:16, unique:users |
| `password` | required, min:8, confirmed |

**Response `201`:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Siti Rahmawati",
      "email": "siti@email.com",
      "phone": "081298887711",
      "nik": "3171058291020003",
      "role": "patient",
      "created_at": "2026-10-23T05:51:39Z"
    },
    "token": "1|abcdefghijklmnopqrstuvwxyz123456"
  }
}
```

---

### `POST /auth/login`
Login untuk pasien dan admin — satu endpoint, role ditentukan server.

**Request Body:**
```json
{
  "email": "siti@email.com",
  "password": "password123"
}
```

**Response `200` — Patient:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Siti Rahmawati",
      "email": "siti@email.com",
      "role": "patient"
    },
    "token": "1|abcdefghijklmnopqrstuvwxyz123456",
    "token_type": "Bearer",
    "expires_in": 1800
  }
}
```

**Response `200` — Admin:**
```json
{
  "success": true,
  "message": "Login admin berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Petugas Administrator Loket",
      "email": "adminganz123@gmail.com",
      "role": "admin",
      "department": "Loket Pendaftaran & Pelayanan Antrean RS"
    },
    "token": "2|xyz987654321abcdefghij",
    "token_type": "Bearer",
    "expires_in": 1800
  }
}
```

**Response `401` — Wrong Credentials:**
```json
{
  "success": false,
  "message": "Email atau kata sandi salah.",
  "error_code": "INVALID_CREDENTIALS"
}
```

**Response `429` — Brute Force Locked:**
```json
{
  "success": false,
  "message": "Akun dikunci 15 menit akibat 5 kali kegagalan login berturut-turut.",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "data": {
    "locked_until": "2026-10-23T06:10:00Z",
    "remaining_seconds": 540
  }
}
```

---

### `POST /auth/logout`
Invalidate token aktif.

**Headers:** `Authorization: Bearer {token}`

**Response `200`:**
```json
{
  "success": true,
  "message": "Berhasil logout. Sesi dihapus."
}
```

---

### `GET /auth/me`
Ambil data user yang sedang login.

**Headers:** `Authorization: Bearer {token}`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Siti Rahmawati",
    "email": "siti@email.com",
    "phone": "081298887711",
    "nik": "3171058291020003",
    "role": "patient",
    "created_at": "2026-10-23T05:51:39Z"
  }
}
```

---

## 2. Pasien (User)

### `GET /patient/profile`
Ambil profil pasien yang login.

**Headers:** `Authorization: Bearer {token}` | **Role:** `patient`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Siti Rahmawati",
    "email": "siti@email.com",
    "phone": "081298887711",
    "nik": "3171058291020003",
    "role": "patient",
    "appointments_count": 3,
    "created_at": "2026-10-23T05:51:39Z"
  }
}
```

---

### `PUT /patient/profile`
Update profil pasien.

**Headers:** `Authorization: Bearer {token}` | **Role:** `patient`

**Request Body:**
```json
{
  "name": "Siti Rahmawati Baru",
  "phone": "081312345678"
}
```

---

### `GET /patient/appointments`
Riwayat semua reservasi milik pasien yang login.

**Headers:** `Authorization: Bearer {token}` | **Role:** `patient`

**Query Params:**
| Param | Tipe | Keterangan |
|---|---|---|
| `status` | string | Filter: `pending`, `waiting`, `serving`, `completed`, `cancelled` |
| `page` | integer | Halaman (default: 1) |
| `per_page` | integer | Item per halaman (default: 10) |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "booking_code": "QLS-9102",
      "ticket_number": "A-028",
      "doctor_name": "dr. Adrian Pratama, Sp.PD",
      "clinic_name": "Poli Penyakit Dalam",
      "room": "Ruang 202, Lantai 2",
      "date": "2026-10-23",
      "time_slot": "11:00 - 11:30",
      "status": "pending",
      "payment_method": "BPJS Kesehatan",
      "people_ahead": 3,
      "created_at": "2026-10-23T05:51:39Z"
    }
  ],
  "meta": { "current_page": 1, "total": 5, "per_page": 10 }
}
```

---

## 3. Dokter

### `GET /doctors`
Daftar semua dokter dengan opsional filter.

**Query Params:**
| Param | Tipe | Keterangan |
|---|---|---|
| `specialty_id` | string | Filter per klinik (`penyakit-dalam`, `anak`, dll) |
| `search` | string | Cari nama dokter |
| `available_date` | date | Filter dokter yang praktik pada tanggal tertentu (`YYYY-MM-DD`) |
| `page` | integer | Halaman |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "dr. Adrian Pratama, Sp.PD, K-GEH",
      "specialty": "Poli Penyakit Dalam",
      "specialty_id": "penyakit-dalam",
      "photo_url": "https://api.qlessmedika.co.id/storage/doctors/dr-adrian.jpg",
      "room": "Ruang 202, Lantai 2",
      "schedule": [
        { "day": "Senin", "start": "08:00", "end": "14:00" },
        { "day": "Rabu", "start": "14:00", "end": "20:00" }
      ],
      "avg_wait_minutes": 12,
      "is_available_today": true,
      "rating": 4.9
    }
  ],
  "meta": { "current_page": 1, "total": 18 }
}
```

---

### `GET /doctors/{id}`
Detail satu dokter beserta slot tersedia.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "dr. Adrian Pratama, Sp.PD, K-GEH",
    "specialty": "Poli Penyakit Dalam",
    "education": ["FK UI 2005", "Sp.PD FKUI 2012"],
    "biography": "Dokter spesialis penyakit dalam...",
    "room": "Ruang 202, Lantai 2",
    "schedule": [...],
    "available_slots": [
      { "date": "2026-10-24", "slots": ["09:00", "09:30", "10:00"] }
    ]
  }
}
```

---

## 4. Spesialisasi / Klinik

### `GET /specialties`
Daftar semua spesialisasi / poli yang tersedia.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "penyakit-dalam",
      "name": "Poli Penyakit Dalam",
      "code": "INT",
      "doctor_count": 18,
      "room": "Lantai 2, Ruang 201-206",
      "description": "Diagnosa dan penanganan gangguan organ dalam dewasa.",
      "avg_wait_time": "10-15 menit",
      "queue_prefix": "A",
      "current_queue_status": "serving"
    }
  ]
}
```

---

## 5. Appointment / Reservasi

### `POST /appointments`
Buat reservasi baru.

**Headers:** `Authorization: Bearer {token}` | **Role:** `patient`

**Request Body:**
```json
{
  "doctor_id": 1,
  "specialty_id": "penyakit-dalam",
  "date": "2026-10-24",
  "time_slot": "10:00",
  "payment_method": "BPJS Kesehatan",
  "notes": "Rujukan FKTP, keluhan nyeri ulu hati berulang.",
  "patient_nik": "3171058291020003"
}
```

**Validasi:**
| Field | Aturan |
|---|---|
| `doctor_id` | required, exists:doctors,id |
| `specialty_id` | required, exists:specialties,id |
| `date` | required, date, after_or_equal:today |
| `time_slot` | required, string |
| `payment_method` | required, in:BPJS Kesehatan,Asuransi Swasta,Umum / Mandiri |
| `notes` | nullable, string, max:500 |

**Response `201`:**
```json
{
  "success": true,
  "message": "Reservasi berhasil dibuat. Menunggu konfirmasi loket.",
  "data": {
    "id": 101,
    "booking_code": "QLS-9102",
    "ticket_number": "A-028",
    "doctor_name": "dr. Adrian Pratama, Sp.PD",
    "clinic_name": "Poli Penyakit Dalam",
    "room": "Ruang 202, Lantai 2",
    "date": "2026-10-24",
    "time_slot": "10:00 - 10:30",
    "status": "pending",
    "people_ahead": 3,
    "estimated_call": "10:15 WIB",
    "payment_method": "BPJS Kesehatan",
    "qr_code_url": "https://api.qlessmedika.co.id/qr/QLS-9102.png",
    "created_at": "2026-10-23T05:51:39Z"
  }
}
```

---

### `GET /appointments/{booking_code}`
Cek status reservasi berdasarkan kode booking (**publik, tanpa auth**).

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "booking_code": "QLS-9102",
    "ticket_number": "A-028",
    "patient_name": "Siti Rahmawati",
    "doctor_name": "dr. Adrian Pratama, Sp.PD",
    "clinic_name": "Poli Penyakit Dalam",
    "status": "waiting",
    "people_ahead": 2,
    "estimated_call": "11:15 WIB",
    "accepted_at": "10:05 WIB"
  }
}
```

---

### `DELETE /appointments/{id}`
Batalkan reservasi (hanya jika status masih `pending`).

**Headers:** `Authorization: Bearer {token}` | **Role:** `patient`

**Response `200`:**
```json
{
  "success": true,
  "message": "Reservasi berhasil dibatalkan."
}
```

---

## 6. Queue / Antrean

### `GET /queue`
Status antrean real-time semua klinik (**publik**).

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "clinic_id": "penyakit-dalam",
      "clinic_name": "Poli Penyakit Dalam",
      "prefix": "A",
      "counter": "Loket 01",
      "current_number": "A-024",
      "next_number": "A-025",
      "total_waiting": 6,
      "avg_service_time_minutes": 12,
      "active_doctor": "dr. Adrian Pratama, Sp.PD",
      "status": "serving",
      "last_called_at": "10:14 WIB",
      "updated_at": "2026-10-23T03:14:00Z"
    }
  ]
}
```

---

### `GET /queue/{clinic_id}`
Status antrean satu klinik.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "clinic_id": "anak",
    "clinic_name": "Poli Anak",
    "prefix": "B",
    "current_number": "B-012",
    "next_number": "B-013",
    "total_waiting": 3,
    "status": "serving",
    "queue_list": [
      { "ticket_number": "B-013", "status": "waiting", "people_ahead": 0, "estimated_call": "10:25 WIB" },
      { "ticket_number": "B-014", "status": "waiting", "people_ahead": 1, "estimated_call": "10:33 WIB" }
    ]
  }
}
```

---

## 7. Admin — Queue Management

> ⚠️ Semua endpoint di bawah memerlukan:  
> `Authorization: Bearer {admin_token}` dan role `admin`

---

### `GET /admin/queue`
Semua tiket antrean dengan filter.

**Query Params:**
| Param | Tipe | Keterangan |
|---|---|---|
| `status` | string | `pending`, `waiting`, `serving`, `completed`, `cancelled` |
| `clinic_id` | string | Filter per klinik |
| `date` | date | Filter per tanggal (default: hari ini) |
| `search` | string | Cari nama pasien / booking code |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "booking_code": "QLS-9102",
      "ticket_number": "A-028",
      "patient_name": "Dewi Anggraini",
      "nik": "3171058291020003",
      "phone": "081299887711",
      "doctor_name": "dr. Adrian Pratama, Sp.PD",
      "clinic_name": "Poli Penyakit Dalam",
      "clinic_id": "penyakit-dalam",
      "room": "Ruang 202, Lantai 2",
      "date": "2026-10-23",
      "time_slot": "11:00 - 11:30",
      "status": "pending",
      "payment_method": "BPJS Kesehatan",
      "notes": "Rujukan FKTP baru",
      "people_ahead": 3,
      "created_at": "2026-10-23T04:46:39Z"
    }
  ],
  "meta": { "current_page": 1, "total": 12 }
}
```

---

### `PATCH /admin/queue/{id}/accept`
Terima antrean — `pending` → `waiting`.

**Request Body:**
```json
{
  "notes": "Pasien telah hadir dan diverifikasi di loket."
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Antrean QLS-9102 berhasil diterima.",
  "data": {
    "id": 101,
    "booking_code": "QLS-9102",
    "ticket_number": "A-028",
    "status": "waiting",
    "accepted_at": "2026-10-23T04:05:00Z",
    "people_ahead": 2
  }
}
```

---

### `PATCH /admin/queue/{id}/call`
Panggil pasien — `waiting` → `serving`.

**Response `200`:**
```json
{
  "success": true,
  "message": "Nomor A-028 berhasil dipanggil.",
  "data": {
    "id": 101,
    "ticket_number": "A-028",
    "patient_name": "Dewi Anggraini",
    "status": "serving",
    "called_at": "2026-10-23T04:14:00Z"
  }
}
```

---

### `PATCH /admin/queue/{id}/complete`
Tandai konsultasi selesai — `serving` → `completed`.

**Response `200`:**
```json
{
  "success": true,
  "message": "Konsultasi selesai. Pasien Dewi Anggraini telah dilayani.",
  "data": {
    "id": 101,
    "ticket_number": "A-028",
    "status": "completed",
    "completed_at": "2026-10-23T04:30:00Z",
    "service_duration_minutes": 16
  }
}
```

---

### `PATCH /admin/queue/{id}/cancel`
Batalkan antrean.

**Request Body:**
```json
{
  "reason": "Pasien tidak hadir setelah dipanggil 3 kali."
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Antrean QLS-9102 telah dibatalkan.",
  "data": {
    "id": 101,
    "status": "cancelled",
    "cancelled_at": "2026-10-23T04:15:00Z",
    "cancellation_reason": "Pasien tidak hadir setelah dipanggil 3 kali."
  }
}
```

---

### `PATCH /admin/clinic/{clinic_id}/status`
Ubah status operasional klinik.

**Request Body:**
```json
{
  "status": "paused"
}
```

**Nilai valid:** `serving` | `paused` | `closed`

---

## 8. Admin — Dashboard Stats

### `GET /admin/dashboard`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_pending": 3,
      "total_waiting": 6,
      "total_serving": 1,
      "total_completed_today": 12,
      "total_cancelled_today": 1,
      "avg_service_duration_minutes": 13
    },
    "clinics": [
      {
        "clinic_id": "penyakit-dalam",
        "clinic_name": "Poli Penyakit Dalam",
        "current_number": "A-024",
        "total_waiting": 6,
        "status": "serving"
      }
    ],
    "recent_activity": [
      { "type": "completed", "ticket_number": "A-025", "patient_name": "Ratna Sari", "time": "10:05 WIB" },
      { "type": "called", "ticket_number": "A-026", "patient_name": "Raditya Pratama", "time": "10:14 WIB" }
    ]
  }
}
```

---

## Error Codes

| HTTP | `error_code` | Keterangan |
|---|---|---|
| `400` | `VALIDATION_FAILED` | Input tidak lolos validasi |
| `401` | `UNAUTHENTICATED` | Token tidak ada / tidak valid |
| `401` | `INVALID_CREDENTIALS` | Email atau password salah |
| `403` | `FORBIDDEN` | Tidak punya akses (mis. pasien akses `/admin`) |
| `404` | `NOT_FOUND` | Resource tidak ditemukan |
| `409` | `DUPLICATE_BOOKING` | Sudah punya reservasi aktif di slot yang sama |
| `410` | `SLOT_UNAVAILABLE` | Slot waktu dokter sudah penuh |
| `422` | `ADMIN_EMAIL_PROTECTED` | Email admin tidak bisa untuk registrasi pasien |
| `429` | `RATE_LIMIT_EXCEEDED` | Brute force / terlalu banyak request |
| `500` | `SERVER_ERROR` | Internal server error |

---

## Database Schema

```sql
-- users (pasien + admin dalam satu tabel)
CREATE TABLE users (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(150) UNIQUE NOT NULL,
    phone          VARCHAR(20),
    nik            CHAR(16) UNIQUE,
    role           ENUM('patient','admin') DEFAULT 'patient',
    password       VARCHAR(255) NOT NULL,
    department     VARCHAR(100) NULL,
    remember_token VARCHAR(100),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- specialties (poli / klinik)
CREATE TABLE specialties (
    id             VARCHAR(50) PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    code           CHAR(3) NOT NULL,
    queue_prefix   CHAR(1) NOT NULL,
    counter        VARCHAR(50),
    room           VARCHAR(100),
    description    TEXT,
    doctor_count   INT DEFAULT 0,
    avg_wait_time  VARCHAR(30),
    status         ENUM('serving','paused','closed') DEFAULT 'serving',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- doctors
CREATE TABLE doctors (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    specialty_id   VARCHAR(50) NOT NULL,
    room           VARCHAR(100),
    photo_path     VARCHAR(255),
    biography      TEXT,
    rating         DECIMAL(3,2) DEFAULT 5.00,
    is_active      BOOLEAN DEFAULT TRUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- doctor_schedules
CREATE TABLE doctor_schedules (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    doctor_id      BIGINT UNSIGNED NOT NULL,
    day_of_week    TINYINT NOT NULL,   -- 0=Minggu .. 6=Sabtu
    start_time     TIME NOT NULL,
    end_time       TIME NOT NULL,
    max_patients   INT DEFAULT 20,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- appointments (reservasi + tiket antrean)
CREATE TABLE appointments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_code        VARCHAR(20) UNIQUE NOT NULL,   -- QLS-XXXX
    ticket_number       VARCHAR(10) NOT NULL,            -- A-028
    user_id             BIGINT UNSIGNED NOT NULL,
    doctor_id           BIGINT UNSIGNED NOT NULL,
    specialty_id        VARCHAR(50) NOT NULL,
    date                DATE NOT NULL,
    time_slot           VARCHAR(30) NOT NULL,
    payment_method      ENUM('BPJS Kesehatan','Asuransi Swasta','Umum / Mandiri'),
    notes               TEXT,
    status              ENUM('pending','waiting','serving','completed','cancelled') DEFAULT 'pending',
    people_ahead        INT DEFAULT 0,
    estimated_call      VARCHAR(20),
    accepted_at         TIMESTAMP NULL,
    called_at           TIMESTAMP NULL,
    completed_at        TIMESTAMP NULL,
    cancelled_at        TIMESTAMP NULL,
    cancellation_reason TEXT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)      REFERENCES users(id),
    FOREIGN KEY (doctor_id)    REFERENCES doctors(id),
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- queue_status (state real-time per klinik)
CREATE TABLE queue_status (
    clinic_id                VARCHAR(50) PRIMARY KEY,
    current_number           VARCHAR(10),
    next_number              VARCHAR(10),
    total_waiting            INT DEFAULT 0,
    avg_service_time_minutes INT DEFAULT 10,
    active_doctor            VARCHAR(150),
    status                   ENUM('serving','paused','closed') DEFAULT 'serving',
    last_called_at           TIMESTAMP NULL,
    updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES specialties(id)
);

-- login_attempts (anti brute-force)
CREATE TABLE login_attempts (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(150) NOT NULL,
    ip_address   VARCHAR(45),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_time (email, attempted_at)
);
```

---

## 🔄 Real-time Events (Laravel Broadcasting)

| Event | Channel | Payload |
|---|---|---|
| `QueueUpdated` | `queue.{clinic_id}` | `{ clinic_id, current_number, total_waiting, status }` |
| `TicketCalled` | `ticket.{booking_code}` | `{ ticket_number, patient_name, room }` |
| `AppointmentAccepted` | `user.{user_id}` | `{ booking_code, ticket_number, people_ahead }` |
| `AppointmentCompleted` | `user.{user_id}` | `{ booking_code, completed_at }` |

**Frontend listener (src/services/realtime.js):**
```js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
});

export function subscribeToClinicQueue(clinicId, callback) {
  return echo.channel(`queue.${clinicId}`).listen('QueueUpdated', callback);
}

export function subscribeToTicket(bookingCode, callback) {
  return echo.channel(`ticket.${bookingCode}`).listen('TicketCalled', callback);
}
```

---

## 🔧 Laravel Route Definitions

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:5,15');
    Route::post('/logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/profile',      [PatientController::class, 'profile']);
        Route::put('/profile',      [PatientController::class, 'update']);
        Route::get('/appointments', [AppointmentController::class, 'myAppointments']);
    });

    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/queue',                 [AdminQueueController::class, 'index']);
        Route::get('/dashboard',             [AdminQueueController::class, 'dashboard']);
        Route::patch('/queue/{id}/accept',   [AdminQueueController::class, 'accept']);
        Route::patch('/queue/{id}/call',     [AdminQueueController::class, 'call']);
        Route::patch('/queue/{id}/complete', [AdminQueueController::class, 'complete']);
        Route::patch('/queue/{id}/cancel',   [AdminQueueController::class, 'cancel']);
        Route::patch('/clinic/{id}/status',  [AdminQueueController::class, 'updateClinicStatus']);
    });

    // Appointments (auth required)
    Route::post('/appointments',       [AppointmentController::class, 'store']);
    Route::delete('/appointments/{id}',[AppointmentController::class, 'cancel']);
});

// Public routes (no auth)
Route::get('/queue',                [QueueController::class, 'index']);
Route::get('/queue/{clinicId}',     [QueueController::class, 'show']);
Route::get('/specialties',          [SpecialtyController::class, 'index']);
Route::get('/doctors',              [DoctorController::class, 'index']);
Route::get('/doctors/{id}',         [DoctorController::class, 'show']);
Route::get('/appointments/{code}',  [AppointmentController::class, 'showByCode']);
```

---

*Dokumentasi ini dibuat berdasarkan struktur data frontend Qless Medika v1.0.0 — siap diimplementasikan sebagai kontrak API Laravel backend.*
