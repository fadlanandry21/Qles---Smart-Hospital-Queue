# QLess — Hospital Queue & Appointment Management System

> Backend development guide for QLess, a hospital appointment and queue management system built with **Laravel 12**, **PHP**, and **MySQL**.

## 1. Project Overview

QLess helps patients request a consultation appointment without registering in a manual queue. Patients submit a booking form on the existing HTML website. An administrator reviews each request and either confirms or rejects it. The application stores booking data and its status in MySQL.

This README is a backend implementation plan based on the supplied `index.html`. The current page contains two booking entry points:

- **Quick booking widget:** department, optional doctor, date, and time.
- **Booking modal:** full name, phone number, and a combined department/doctor option.

The backend should normalize these into one consistent appointment record. The form must send the patient’s name and phone number as well as the selected department, doctor (optional), date, and time. Keep the visual design; update the form markup and JavaScript to submit real data to Laravel.

### Goals

- Create, view, edit, and delete appointment/queue requests (CRUD).
- Provide a protected administrator login.
- Allow admins to confirm or reject requests with server-side validation.
- Track status changes and provide clear feedback to patients.
- Store departments, doctors, administrators, appointments, and status history in MySQL.
- Integrate with the existing HTML/CSS/JavaScript front end.

## 2. Proposed Scope

### Patient features

- Submit an appointment request.
- Select a department and optionally a doctor.
- Select an appointment date and available time.
- Receive a reference code after the request is saved.
- Check the request status using a reference code and phone number (recommended).
- Edit or cancel a request only while it is still pending, if that policy is enabled.

### Admin features

- Sign in and sign out securely.
- View appointment requests and filter them by date, department, and status.
- View the details of a request.
- Confirm or reject a pending request.
- Enter a rejection reason.
- Edit or delete a request according to the hospital's operational policy.
- View status history for audit purposes.

> **Important:** A submitted request should start as `pending`, not `confirmed`. The patient must not be shown a confirmed appointment until an administrator confirms it. Re-check slot availability on the server when confirming a request.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Backend framework | Laravel 12 |
| Language | PHP version compatible with Laravel 12 |
| Database | MySQL |
| Authentication | Laravel session authentication; Laravel Breeze is a suitable starter for a Blade-based admin login |
| Front end | Existing HTML, CSS, and JavaScript |
| Database access | Eloquent ORM and Laravel migrations |
| Validation | Form Request classes and authorization policies/middleware |

Use the official Laravel 12 documentation when setting up the project: <https://laravel.com/docs/12.x>.

## 4. Recommended Database Design

Use Laravel's default `users` table for administrator accounts, then add tables for departments, doctors, appointments, and status history. Do not store department names, doctor names, and appointment status only as free-text values if they can be represented by related tables.

### 4.1 `users`

Stores administrator accounts. Use Laravel's standard authentication fields and add a role if the application may later support multiple account types.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT, PK | Primary key |
| `name` | VARCHAR | Admin display name |
| `email` | VARCHAR, unique | Login identity |
| `password` | VARCHAR | Store only a password hash |
| `role` | VARCHAR / ENUM | For example, `admin` |
| `email_verified_at` | TIMESTAMP, nullable | Optional |
| `remember_token` | VARCHAR, nullable | Laravel default |
| `created_at`, `updated_at` | TIMESTAMP | Laravel timestamps |

If the application only needs one admin type, access can be restricted through an `is_admin` boolean or a role field. Enforce the role on the server; hiding an admin button in HTML is not security.

### 4.2 `departments`

Stores available hospital departments.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT, PK | Primary key |
| `name` | VARCHAR, unique | e.g. Cardiology, Neurology |
| `description` | TEXT, nullable | Optional description |
| `is_active` | BOOLEAN | Whether patients can select it |
| `created_at`, `updated_at` | TIMESTAMP | Laravel timestamps |

Seed initial departments based on the website, such as Cardiology, Neurology, Orthopedics, Gastroenterology, Pediatrics, Gynecology, Urology, and Oncology. Confirm the actual list with the hospital before production use.

### 4.3 `doctors`

Stores doctors and their department relationship.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT, PK | Primary key |
| `department_id` | BIGINT, FK | References `departments.id` |
| `name` | VARCHAR | Doctor's name |
| `specialization` | VARCHAR, nullable | Optional |
| `is_active` | BOOLEAN | Whether the doctor can be selected |
| `created_at`, `updated_at` | TIMESTAMP | Laravel timestamps |

A doctor belongs to a department. Validate that a selected doctor is active and belongs to the selected department.

### 4.4 `appointments`

This is the central table for booking and queue requests.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT, PK | Primary key |
| `reference_code` | VARCHAR, unique | Public lookup code, generated by the server |
| `patient_name` | VARCHAR | Required |
| `patient_phone` | VARCHAR | Required; store as text, not an integer |
| `department_id` | BIGINT, FK | References `departments.id` |
| `doctor_id` | BIGINT, FK, nullable | Optional doctor |
| `appointment_date` | DATE | Requested consultation date |
| `appointment_time` | TIME | Requested time |
| `status` | VARCHAR / ENUM | `pending`, `confirmed`, `rejected`, `cancelled`, `completed` |
| `queue_number` | VARCHAR, nullable | Assign according to the hospital's queue policy |
| `admin_note` | TEXT, nullable | Internal note; do not expose by default |
| `rejection_reason` | TEXT, nullable | Required when rejecting |
| `reviewed_by` | BIGINT, FK, nullable | References `users.id` |
| `reviewed_at` | TIMESTAMP, nullable | When an admin reviewed it |
| `created_at`, `updated_at` | TIMESTAMP | Laravel timestamps |

**Database rules to implement:**

- `reference_code` must be unique and difficult to guess.
- `department_id` must reference an active department.
- If supplied, `doctor_id` must reference an active doctor in that department.
- `appointment_date` must not be in the past.
- The server must validate that the chosen time is allowed.
- Prevent duplicate confirmed appointments for the same doctor/date/time, or for the same department/date/time if the hospital books department-wide slots.
- Use a database transaction and re-check availability when confirming to reduce race conditions.
- Define how queue numbers are assigned before implementing them. An appointment time and a walk-in queue number are not necessarily the same thing.

The exact unique-slot rule depends on hospital policy. If each doctor can see one patient per slot, enforce uniqueness for `(doctor_id, appointment_date, appointment_time)` when `doctor_id` is present. If slots are allocated by department instead, the rule must be designed around that model. A simple unique constraint on nullable doctor IDs alone may not enforce every policy in MySQL; use a transaction and explicit availability checks as well.

### 4.5 `appointment_status_histories`

Records every status transition for accountability.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT, PK | Primary key |
| `appointment_id` | BIGINT, FK | References `appointments.id` |
| `changed_by` | BIGINT, FK, nullable | Admin user; null for system-created events |
| `from_status` | VARCHAR, nullable | Empty for the initial request |
| `to_status` | VARCHAR | New status |
| `note` | TEXT, nullable | Rejection reason or review note |
| `created_at` | TIMESTAMP | Time of the change |

This history table is strongly recommended. It makes it possible to audit who changed a request and when.

### Relationship summary

```text
users (admin) 1 ───── * appointments (reviewed_by)
departments   1 ───── * doctors
departments   1 ───── * appointments
doctors       1 ───── * appointments (doctor is optional)
appointments  1 ───── * appointment_status_histories
users         1 ───── * appointment_status_histories (changed_by)
```

## 5. Appointment Status Workflow

```text
Patient submits form
        |
        v
     PENDING
      /   \
     /     \
Confirm   Reject
   |         |
   v         v
CONFIRMED  REJECTED
   |
   +----> COMPLETED (after the visit)

PENDING or CONFIRMED ---> CANCELLED (according to cancellation policy)
```

Recommended transition rules:

- New request → `pending`.
- `pending` → `confirmed` only after authorization and slot availability checks.
- `pending` → `rejected` only after a rejection reason is supplied.
- `confirmed` → `completed` when the visit is finished.
- Cancellation rules should be explicit and enforced server-side.
- Do not allow a rejected or completed appointment to be confirmed again without a deliberate administrative workflow.

## 6. Suggested Laravel Project Structure

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── AppointmentController.php
│   │   ├── Admin/
│   │   │   ├── AuthController.php
│   │   │   └── AppointmentReviewController.php
│   └── Requests/
│       ├── StoreAppointmentRequest.php
│       ├── UpdateAppointmentRequest.php
│       └── ReviewAppointmentRequest.php
├── Models/
│   ├── User.php
│   ├── Department.php
│   ├── Doctor.php
│   ├── Appointment.php
│   └── AppointmentStatusHistory.php
├── Policies/
│   └── AppointmentPolicy.php
└── Services/
    └── AppointmentService.php

database/
├── migrations/
└── seeders/
    ├── DepartmentSeeder.php
    └── AdminUserSeeder.php

resources/views/
├── layouts/
├── appointments/
│   ├── create.blade.php
│   ├── show.blade.php
│   └── status.blade.php
└── admin/
    ├── auth/login.blade.php
    └── appointments/
        ├── index.blade.php
        └── show.blade.php

routes/
└── web.php
```

This is a recommended organization, not a requirement to create every file immediately. `AppointmentService` is useful for keeping confirmation, slot checking, queue-number assignment, and status-history logic out of controllers.

## 7. Step-by-Step Implementation

### Step 1 — Check the development environment

Install and verify PHP, Composer, and MySQL. Laravel 12 requires a compatible PHP version and the required PHP extensions. Check the current Laravel 12 requirements before choosing a PHP version.

```bash
php -v
composer -V
```

If using Laragon on Windows, start Apache/Nginx and MySQL from Laragon before testing the app.

### Step 2 — Create the Laravel 12 project

```bash
composer create-project laravel/laravel qless "^12.0"
cd qless
php artisan --version
```

Confirm that the output identifies Laravel Framework 12.x.

### Step 3 — Create the MySQL database

Create a database, for example `qless_db`, in phpMyAdmin or the MySQL client. Then configure the project's `.env` file:

```dotenv
APP_NAME=QLess
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=qless_db
DB_USERNAME=root
DB_PASSWORD=
```

Use the actual MySQL username and password from your machine. The empty password above is only a common local-development example; do not use it for a production database. Never commit `.env` to Git.

Then run:

```bash
php artisan config:clear
php artisan migrate
```

### Step 4 — Add admin authentication

For a server-rendered Laravel application, Laravel Breeze with Blade is a practical starting point. Follow the installation instructions appropriate to Laravel 12 in the official documentation or the starter-kit documentation.

After installing the selected authentication starter:

- Use login and logout routes.
- Protect admin routes with `auth` middleware.
- Add an admin-role check using middleware or a policy.
- Prevent public registration from creating admin accounts.
- Create the initial admin through a seeder or a controlled command, not through a public form.
- Hash passwords using Laravel's `Hash` facade.

Do not hardcode an administrator password into source control. For local testing, use a development-only seeder and change the credentials before deployment.

### Step 5 — Create models and migrations

Generate the model/migration pairs:

```bash
php artisan make:model Department -m
php artisan make:model Doctor -m
php artisan make:model Appointment -m
php artisan make:model AppointmentStatusHistory -m
```

Edit the generated migration files to match the schema in Section 4. Add foreign keys, indexes, nullable fields, and appropriate delete behavior. Prefer preserving appointment and audit history rather than cascading destructive deletes.

After creating the migrations:

```bash
php artisan migrate
```

Use seeders for initial departments and a development admin account. Do not invent a final list of doctors; populate it from verified hospital data.

### Step 6 — Define Eloquent relationships

Examples of the relationships to define:

- `Department` has many `Doctor` records.
- `Department` has many `Appointment` records.
- `Doctor` belongs to `Department` and has many appointments.
- `Appointment` belongs to `Department`, optionally belongs to `Doctor`, and has many status-history records.
- `Appointment` belongs to the reviewing `User`.
- `AppointmentStatusHistory` belongs to its appointment and optionally to the admin user who made the change.

Use `$fillable` or explicit assignment carefully. Never mass-assign fields such as `status`, `reviewed_by`, `queue_number`, or `reference_code` directly from an untrusted patient request.

### Step 7 — Build validation rules

Create Form Request classes:

```bash
php artisan make:request StoreAppointmentRequest
php artisan make:request UpdateAppointmentRequest
php artisan make:request ReviewAppointmentRequest
```

Suggested validation for patient submissions (adapt rule syntax to the exact schema and Laravel version):

- `patient_name`: required, string, maximum length.
- `patient_phone`: required, string, maximum length; normalize and validate the format.
- `department_id`: required, integer, exists in the departments table; additionally verify that it is active.
- `doctor_id`: nullable, integer, exists in doctors; verify that it is active and belongs to `department_id`.
- `appointment_date`: required date, not before today.
- `appointment_time`: required and must be one of the allowed slot values.
- Reject unexpected fields by only persisting validated data.

The review request should accept an explicit action (`confirm` or `reject`) and a rejection reason when rejecting. Validate the action against an allow-list. The server must not trust a status sent from the browser.

### Step 8 — Implement appointment CRUD

Create the controller:

```bash
php artisan make:controller AppointmentController
```

Recommended responsibilities:

| Operation | Suggested route | Access |
|---|---|---|
| Show booking form | `GET /appointments/create` | Public |
| Save a new request | `POST /appointments` | Public, validated |
| Look up status | `GET /appointments/status` | Public with reference code + phone verification |
| View request details | `GET /appointments/{appointment}` | Authorized access only |
| Edit a pending request | `PUT /appointments/{appointment}` | Patient verification or admin |
| Delete/cancel a request | `DELETE /appointments/{appointment}` | Policy-controlled |
| List all requests | `GET /admin/appointments` | Admin |
| View a request in admin | `GET /admin/appointments/{appointment}` | Admin |
| Confirm/reject request | `PATCH /admin/appointments/{appointment}/review` | Admin |

Use route model binding carefully. Do not expose sequential appointment IDs as sufficient proof that a patient may see personal information. For public status lookup, require the generated reference code plus a verified phone number or another appropriate authentication mechanism.

### Step 9 — Implement admin confirmation and rejection

Create a review controller:

```bash
php artisan make:controller Admin/AppointmentReviewController
```

Confirmation should perform these steps:

1. Authenticate the administrator and authorize the action.
2. Load the appointment inside a database transaction.
3. Lock or otherwise safely coordinate the relevant appointment/slot records.
4. Verify that the current status is `pending`.
5. Re-check that the requested slot remains available.
6. Set status to `confirmed`, record `reviewed_by` and `reviewed_at`, and assign a queue number if required.
7. Insert an `appointment_status_histories` record.
8. Commit the transaction and return a success message.

Rejection should:

1. Authenticate and authorize the administrator.
2. Require a meaningful rejection reason.
3. Verify that the current status permits rejection.
4. Set status to `rejected`, save the reason and review metadata.
5. Insert a status-history record.
6. Return a clear result to the admin.

Do not simply trust a button click or a hidden form field. All checks must run on the server. If two admins try to confirm conflicting requests at the same time, only one request should be able to claim the slot.

### Step 10 — Connect the supplied HTML form to Laravel

The supplied `index.html` is currently a static HTML page. It includes JavaScript handlers such as `handleFormSubmit(event)`, `handleModalSubmit(event)`, and `openModal()`. These are front-end functions, not backend endpoints.

Recommended integration approach: use **Blade views** for the existing page and Laravel web routes for form submissions.

1. Move the HTML into `resources/views/home.blade.php`.
2. Keep the CSS, images, and JavaScript in `public/` (or another properly configured asset pipeline).
3. Replace static department/doctor `<option>` elements with data loaded from Laravel.
4. Make the booking form submit all required fields to the Laravel route.
5. Include `@csrf` inside every Blade POST form.
6. Use `@method('PUT')`, `@method('PATCH')`, or `@method('DELETE')` for HTML forms that need those HTTP methods.
7. Return validation errors beside the relevant fields and preserve old values using Blade's `old()` helper.
8. Show a confirmation message only after Laravel successfully saves the request.

The current quick widget does not collect the patient's name or phone, while the modal does not collect the date/time and stores department/doctor as one combined display string. Update the UI so the final submission contains these fields separately:

```text
patient_name
patient_phone
department_id
doctor_id (optional)
appointment_date
appointment_time
```

Use numeric IDs for `department_id` and `doctor_id`, not the display text such as `"Cardiology - Dr. Rajeev Sharma"`. The backend should resolve names from the related tables.

Example Blade form skeleton:

```blade
<form method="POST" action="{{ route('appointments.store') }}">
    @csrf

    <label for="patient_name">Nama Lengkap</label>
    <input
        id="patient_name"
        name="patient_name"
        type="text"
        value="{{ old('patient_name') }}"
        required
    >

    <label for="patient_phone">Nomor Telepon</label>
    <input
        id="patient_phone"
        name="patient_phone"
        type="tel"
        value="{{ old('patient_phone') }}"
        required
    >

    <label for="department_id">Department</label>
    <select id="department_id" name="department_id" required>
        <option value="">Pilih department</option>
        @foreach ($departments as $department)
            <option
                value="{{ $department->id }}"
                @selected(old('department_id') == $department->id)
            >
                {{ $department->name }}
            </option>
        @endforeach
    </select>

    <label for="doctor_id">Doctor (optional)</label>
    <select id="doctor_id" name="doctor_id">
        <option value="">Pilih dokter (opsional)</option>
        @foreach ($doctors as $doctor)
            <option
                value="{{ $doctor->id }}"
                @selected(old('doctor_id') == $doctor->id)
            >
                {{ $doctor->name }}
            </option>
        @endforeach
    </select>

    <label for="appointment_date">Date</label>
    <input
        id="appointment_date"
        name="appointment_date"
        type="date"
        min="{{ now()->toDateString() }}"
        value="{{ old('appointment_date') }}"
        required
    >

    <label for="appointment_time">Time</label>
    <select id="appointment_time" name="appointment_time" required>
        <option value="">Pilih waktu</option>
        {{-- Render only allowed slots supplied by the backend --}}
    </select>

    <button type="submit">Ajukan Booking</button>
</form>
```

This is a starting template, not a complete drop-in replacement for the supplied page. Merge these fields into the existing design and ensure the doctor list is filtered by the selected department. The backend must repeat every important validation even if the browser already validates the form.

If you prefer to keep a completely separate static front end, expose a Laravel API and submit JSON using `fetch()`. In that case, design API authentication, CSRF/CORS behavior, response formats, and error handling deliberately. Do not mix the Blade form approach and a public unauthenticated admin API accidentally.

### Step 11 — Define routes

A starting point for `routes/web.php` (adapt controller namespaces and route names to your implementation):

```php
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Admin\AppointmentReviewController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AppointmentController::class, 'home'])->name('home');

Route::get('/appointments/create', [AppointmentController::class, 'create'])
    ->name('appointments.create');
Route::post('/appointments', [AppointmentController::class, 'store'])
    ->name('appointments.store');
Route::get('/appointments/status', [AppointmentController::class, 'lookup'])
    ->name('appointments.lookup');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'adminIndex'])
        ->name('appointments.index');
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'adminShow'])
        ->name('appointments.show');
    Route::patch(
        '/appointments/{appointment}/review',
        [AppointmentReviewController::class, 'update']
    )->name('appointments.review');
});
```

The `admin` middleware in this example is a middleware you must implement (or replace with an equivalent role policy). The example intentionally does not expose unrestricted public update/delete routes. Add those only after defining how a patient proves ownership of a request.

### Step 12 — Add tests

Create automated tests for at least these cases:

- A valid booking creates one `pending` appointment.
- Missing required fields fail validation.
- A past date is rejected.
- An inactive department or doctor is rejected.
- A doctor from a different department is rejected.
- A guest cannot access admin pages or review actions.
- A non-admin authenticated user cannot review requests.
- An admin can confirm a pending request when the slot is available.
- Confirmation fails if the slot has already been taken.
- An admin cannot confirm an already rejected or completed request.
- Rejection fails without a reason.
- Each review action writes a status-history record.
- Public status lookup does not disclose another patient's appointment using only a sequential ID.

Run the test suite:

```bash
php artisan test
```

Use a separate testing database or Laravel's supported test database configuration. Do not run destructive tests against real hospital data.

### Step 13 — Run the application locally

```bash
php artisan serve
```

Open the local URL printed by Artisan (commonly `http://127.0.0.1:8000`). Test the public form, database persistence, admin login, review workflow, validation errors, and duplicate-slot behavior.

Useful commands:

```bash
php artisan route:list
php artisan migrate:status
php artisan make:controller ExampleController
php artisan make:request ExampleRequest
```

## 8. Security and Privacy Checklist

Because this application stores patient contact details and appointment information:

- Keep `APP_DEBUG=false` in production.
- Use HTTPS in production.
- Store passwords as hashes; never store plain-text passwords.
- Protect every admin route with authentication and authorization.
- Validate and authorize every mutation on the server.
- Add rate limiting to booking and status-lookup endpoints.
- Avoid exposing patient names, phone numbers, internal notes, or rejection details to unauthorized users.
- Generate opaque reference codes and avoid treating appointment IDs as access credentials.
- Use CSRF protection for session-authenticated web forms.
- Keep secrets in environment variables and out of Git.
- Back up the database and define a retention policy.
- Log administrative status changes without logging unnecessary sensitive data.
- Collect only the patient data the workflow genuinely needs.
- Before real-world use, review applicable Indonesian personal-data and healthcare requirements with the responsible organization.

## 9. Suggested Development Milestones

| Milestone | Deliverable |
|---|---|
| 1. Project setup | Laravel 12 project, MySQL connection, migrations |
| 2. Master data | Department and doctor tables plus seeders/admin management |
| 3. Patient booking | Existing form integrated with validated appointment creation |
| 4. Admin authentication | Login, logout, role-protected admin pages |
| 5. Review workflow | Confirm/reject, rejection reason, status history |
| 6. Slot protection | Availability checks and concurrent-request safeguards |
| 7. Patient status lookup | Reference code plus phone verification |
| 8. Testing and hardening | Feature tests, security checks, backups, deployment configuration |

## 10. Decisions to Confirm Before Production

The supplied HTML provides the visual form and example choices, but it does not define the hospital's operational rules. Confirm the following before finalizing the database and business logic:

1. **Slot availability:** Is a slot reserved per doctor, per department, or per clinic room?
2. **Queue number:** Is the number assigned when the request is submitted or only after admin confirmation?
3. **Patient identity:** Is name and phone number enough, or is patient registration/authentication required?
4. **Cancellation and editing:** Can patients change or cancel a pending/confirmed request? Until what time?
5. **Doctor selection:** Is choosing a doctor optional, and should the list update after choosing a department?
6. **Notifications:** Should confirmation/rejection be sent by email, WhatsApp, SMS, or only displayed on the website?
7. **Admin roles:** Is there one administrator role, or are separate receptionist/doctor/admin permissions needed?

## 11. Definition of Done

The initial version can be considered ready for internal testing when:

- A patient can submit the form and the appointment is saved in MySQL.
- Invalid submissions show useful validation messages.
- Every new request starts with `pending` status.
- Only authorized admins can confirm or reject requests.
- Confirmation re-checks availability and cannot create a duplicate confirmed slot.
- Rejection requires a reason.
- Status changes are recorded in the history table.
- Patient lookup does not reveal another person's information.
- Automated tests pass and the application does not expose secrets or debug output.

---

**Project:** QLess  
**Framework:** Laravel 12  
**Database:** MySQL  
**Document purpose:** Backend architecture and implementation roadmap  
