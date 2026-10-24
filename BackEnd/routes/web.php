<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Admin\AppointmentReviewController;
use App\Http\Controllers\Admin\AuthController;
use Illuminate\Support\Facades\Route;


// Public Passenger / Patient Routes
Route::get('/', [AppointmentController::class, 'create'])->name('home');
Route::get('/appointments/create', [AppointmentController::class, 'create'])->name('appointments.create');
Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
Route::get('/appointments/status', [AppointmentController::class, 'lookup'])->name('appointments.lookup');

// Protected Admin Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/appointments', function () {
        $appointments = \App\Models\Appointment::with(['department', 'doctor'])->latest()->get();
        return view('admin.appointments.index', compact('appointments'));
    })->name('appointments.index');

    Route::patch('/appointments/{appointment}/review', [AppointmentReviewController::class, 'update'])
        ->name('appointments.review');
});
