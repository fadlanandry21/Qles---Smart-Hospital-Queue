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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->string('slug')->nullable()->unique(); // e.g. 'doc-1'
            $table->string('name');                        // e.g. 'dr. Adrian Pratama, Sp.PD, K-GEH'
            $table->string('title')->nullable();           // e.g. 'Spesialis Penyakit Dalam - Konsultan...'
            $table->string('specialization')->nullable();  // e.g. 'Penyakit Dalam'
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->string('experience')->nullable();      // e.g. '14 Tahun'
            $table->string('education')->nullable();       // e.g. 'Spesialis Penyakit Dalam FK UI...'
            $table->string('str_number')->nullable();      // e.g. 'STR-31.1.1.100.2.19.08456'
            $table->text('photo')->nullable();
            $table->string('fee')->nullable();             // e.g. 'Rp 350.000'
            $table->json('days')->nullable();              // e.g. ["Senin", "Rabu", "Jumat"]
            $table->string('clinic_room')->nullable();     // e.g. 'Ruang 202, Lantai 2'
            $table->json('time_slots')->nullable();        // e.g. [{"time": "08:30 - 09:00", "available": true, "quotaRemaining": 3}, ...]
            $table->text('bio')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
