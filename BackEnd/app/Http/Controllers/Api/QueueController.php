<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function index(): JsonResponse
    {
        $departments = Department::with(['doctors' => fn($q) => $q->where('is_active', true)->limit(1)])
            ->where('is_active', true)
            ->get()
            ->map(function ($dept) {
                $primaryDoctor = $dept->doctors->first();
                $activeDoctorText = $primaryDoctor ? $primaryDoctor->name : 'Tim Medis Poliklinik';
                if ($dept->slug === 'farmasi') {
                    $activeDoctorText = 'Tim Farmasi Klinis';
                }

                return [
                    'clinicId' => $dept->slug,
                    'clinicName' => $dept->name,
                    'prefix' => $dept->prefix,
                    'counter' => $dept->counter ?: 'Loket 01',
                    'currentNumber' => $dept->current_number ?: ($dept->prefix . '-001'),
                    'nextNumber' => $dept->next_number ?: ($dept->prefix . '-002'),
                    'totalWaiting' => (int) $dept->total_waiting,
                    'avgServiceTimeMinutes' => (int) $dept->avg_service_time_minutes,
                    'activeDoctor' => $activeDoctorText,
                    'status' => $dept->status,
                    'lastCalledAt' => $dept->last_called_at ?: now()->format('H:i') . ' WIB',
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $departments,
        ]);
    }

    public function advance(string $clinicId): JsonResponse
    {
        $dept = Department::where('slug', $clinicId)
            ->orWhere('id', $clinicId)
            ->first();

        if (!$dept) {
            return response()->json([
                'success' => false,
                'message' => 'Poliklinik tidak ditemukan',
            ], 404);
        }

        // Calculate next number
        $curParts = explode('-', $dept->current_number ?: ($dept->prefix . '-000'));
        $seq = isset($curParts[1]) ? (int)$curParts[1] : 0;
        $nextSeq = $seq + 1;
        $afterNextSeq = $nextSeq + 1;

        $newCur = sprintf('%s-%03d', $dept->prefix, $nextSeq);
        $newNext = sprintf('%s-%03d', $dept->prefix, $afterNextSeq);
        $timeStr = now()->format('H:i') . ' WIB';

        $dept->current_number = $newCur;
        $dept->next_number = $newNext;
        $dept->total_waiting = max(0, $dept->total_waiting - 1);
        $dept->last_called_at = $timeStr;
        $dept->save();

        $primaryDoctor = Doctor::where('department_id', $dept->id)->where('is_active', true)->first();
        $activeDoctorText = $primaryDoctor ? $primaryDoctor->name : 'Tim Medis Poliklinik';
        if ($dept->slug === 'farmasi') {
            $activeDoctorText = 'Tim Farmasi Klinis';
        }

        $formatted = [
            'clinicId' => $dept->slug,
            'clinicName' => $dept->name,
            'prefix' => $dept->prefix,
            'counter' => $dept->counter ?: 'Loket 01',
            'currentNumber' => $dept->current_number,
            'nextNumber' => $dept->next_number,
            'totalWaiting' => (int) $dept->total_waiting,
            'avgServiceTimeMinutes' => (int) $dept->avg_service_time_minutes,
            'activeDoctor' => $activeDoctorText,
            'status' => $dept->status,
            'lastCalledAt' => $dept->last_called_at,
        ];

        return response()->json([
            'success' => true,
            'message' => "Antrean {$dept->name} berhasil dimajukan ke nomor {$newCur}",
            'data' => $formatted,
        ]);
    }
}
