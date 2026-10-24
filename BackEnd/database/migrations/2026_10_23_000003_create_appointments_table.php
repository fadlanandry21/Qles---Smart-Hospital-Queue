<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('reference_code')->unique(); // e.g. 'QLS-8821'
            $table->string('ticket_number');            // e.g. 'A-027'
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('patient_name');
            $table->string('patient_phone');
            $table->string('nik');
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctors')->nullOnDelete();
            $table->date('appointment_date');
            $table->string('time_slot');                // e.g. '09:00 - 09:30'
            $table->string('payment_method')->default('Umum / Mandiri'); // 'BPJS Kesehatan', etc.
            $table->text('complaint')->nullable();
            $table->enum('status', ['waiting', 'called', 'serving', 'completed', 'cancelled', 'rejected', 'pending'])->default('waiting');
            $table->string('queue_number')->nullable(); // alias or legacy
            $table->string('estimated_call')->nullable(); // e.g. '10:38 WIB'
            $table->integer('people_ahead')->default(0);
            $table->text('admin_note')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
