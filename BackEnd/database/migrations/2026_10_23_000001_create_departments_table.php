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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // e.g. 'penyakit-dalam', 'anak', etc.
            $table->string('code')->unique(); // e.g. 'INT', 'PED', 'DEN', etc.
            $table->string('prefix', 5);      // e.g. 'A', 'B', 'C', etc.
            $table->string('name');           // e.g. 'Poli Penyakit Dalam'
            $table->string('counter')->nullable(); // e.g. 'Loket 01'
            $table->string('room')->nullable();    // e.g. 'Lantai 2, Ruang 201-206'
            $table->text('description')->nullable();
            $table->integer('avg_service_time_minutes')->default(10);
            $table->string('current_number')->nullable()->default('A-000');
            $table->string('next_number')->nullable()->default('A-001');
            $table->integer('total_waiting')->default(0);
            $table->enum('status', ['serving', 'paused', 'closed'])->default('serving');
            $table->string('last_called_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
