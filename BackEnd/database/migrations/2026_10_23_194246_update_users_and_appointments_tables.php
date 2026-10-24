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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('nik');
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable()->after('address');
            }
            if (!Schema::hasColumn('users', 'birth_date')) {
                $table->date('birth_date')->nullable()->after('gender');
            }
        });

        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'call_count')) {
                $table->unsignedInteger('call_count')->default(0)->after('people_ahead');
            }
            if (!Schema::hasColumn('appointments', 'called_at')) {
                $table->string('called_at')->nullable()->after('call_count');
            }
            if (!Schema::hasColumn('appointments', 'serving_at')) {
                $table->string('serving_at')->nullable()->after('called_at');
            }
            if (!Schema::hasColumn('appointments', 'completed_at')) {
                $table->string('completed_at')->nullable()->after('serving_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['address', 'gender', 'birth_date']);
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['call_count', 'called_at', 'serving_at', 'completed_at']);
        });
    }
};
