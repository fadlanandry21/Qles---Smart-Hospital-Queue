<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $departments = Department::withCount('doctors')
            ->where('is_active', true)
            ->get()
            ->map(function ($dept) {
                return [
                    'id' => $dept->slug,
                    'databaseId' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                    'prefix' => $dept->prefix,
                    'counter' => $dept->counter,
                    'room' => $dept->room,
                    'doctorCount' => $dept->doctors_count,
                    'description' => $dept->description,
                    'avgWaitTime' => $dept->avg_service_time_minutes . ' menit',
                    'avgServiceTimeMinutes' => $dept->avg_service_time_minutes,
                    'currentNumber' => $dept->current_number,
                    'nextNumber' => $dept->next_number,
                    'totalWaiting' => $dept->total_waiting,
                    'status' => $dept->status,
                    'lastCalledAt' => $dept->last_called_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $departments,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $dept = Department::with(['doctors' => fn($q) => $q->where('is_active', true)])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->first();

        if (!$dept) {
            return response()->json([
                'success' => false,
                'message' => 'Poliklinik tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $dept,
        ]);
    }
}
