<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\AppointmentApiController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\ContactApiController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserProfileController;

// ─── V1 Prefix ───────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // ── Auth ──────────────────────────────────────────────────────────────────
    Route::post('/auth/register', [AuthApiController::class, 'register']);
    Route::post('/auth/login', [AuthApiController::class, 'login']);

    // ── User Profile ──────────────────────────────────────────────────────────
    Route::get('/auth/profile/{id}', [UserProfileController::class, 'show']);
    Route::put('/auth/profile/{id}', [UserProfileController::class, 'update']);

    // ── Departments ───────────────────────────────────────────────────────────
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/departments/{slug}', [DepartmentController::class, 'show']);

    // ── Doctors ───────────────────────────────────────────────────────────────
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);

    // ── Queue (Live) ──────────────────────────────────────────────────────────
    Route::get('/queues', [QueueController::class, 'index']);
    Route::post('/queues/{clinicId}/advance', [QueueController::class, 'advance']);

    // ── Appointments (Public) ─────────────────────────────────────────────────
    Route::get('/appointments/search', [AppointmentApiController::class, 'search']);
    Route::get('/appointments', [AppointmentApiController::class, 'index']);
    Route::post('/appointments', [AppointmentApiController::class, 'store']);

    // ── Admin Queue Management ─────────────────────────────────────────────────
    Route::prefix('admin')->group(function () {
        // Dashboard stats
        Route::get('/stats', [AdminController::class, 'getStats']);

        // Ticket management
        Route::get('/appointments', [AdminController::class, 'getTickets']);
        Route::post('/appointments/{id}/accept', [AdminController::class, 'acceptTicket']);
        Route::post('/appointments/{id}/call', [AdminController::class, 'callPatient']);
        Route::post('/appointments/{id}/serve', [AdminController::class, 'servePatient']);
        Route::post('/appointments/{id}/complete', [AdminController::class, 'completeTicket']);
        Route::post('/appointments/{id}/cancel', [AdminController::class, 'cancelTicket']);
        Route::delete('/appointments/{id}', [AdminController::class, 'deleteTicket']);

        // Doctor management
        Route::post('/doctors', [AdminController::class, 'addDoctor']);
        Route::delete('/doctors/{id}', [AdminController::class, 'deleteDoctor']);
    });

    // ── Contact ───────────────────────────────────────────────────────────────
    Route::post('/contact', [ContactApiController::class, 'store']);
});

// ─── Also support non-prefixed for convenience ────────────────────────────────
Route::post('/auth/register', [AuthApiController::class, 'register']);
Route::post('/auth/login', [AuthApiController::class, 'login']);
Route::get('/auth/profile/{id}', [UserProfileController::class, 'show']);
Route::put('/auth/profile/{id}', [UserProfileController::class, 'update']);
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/{slug}', [DepartmentController::class, 'show']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::get('/queues', [QueueController::class, 'index']);
Route::post('/queues/{clinicId}/advance', [QueueController::class, 'advance']);
Route::get('/appointments/search', [AppointmentApiController::class, 'search']);
Route::get('/appointments', [AppointmentApiController::class, 'index']);
Route::post('/appointments', [AppointmentApiController::class, 'store']);
Route::post('/contact', [ContactApiController::class, 'store']);
