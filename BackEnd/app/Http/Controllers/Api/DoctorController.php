<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Doctor::with('department')->where('is_active', true);

        if ($request->filled('specialty') && $request->specialty !== 'all') {
            $query->whereHas('department', function ($q) use ($request) {
                $q->where('slug', $request->specialty);
            });
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('title', 'like', $search)
                  ->orWhere('specialization', 'like', $search);
            });
        }

        $doctors = $query->get()->map(function ($doc) {
            return [
                'id' => $doc->slug ?: 'doc-' . $doc->id,
                'databaseId' => $doc->id,
                'name' => $doc->name,
                'title' => $doc->title,
                'specialty' => $doc->specialization ?: $doc->department?->name,
                'specialtyId' => $doc->department?->slug,
                'departmentId' => $doc->department_id,
                'rating' => (float) $doc->rating,
                'reviewsCount' => (int) $doc->reviews_count,
                'experience' => $doc->experience,
                'education' => $doc->education,
                'strNumber' => $doc->str_number,
                'photo' => $doc->photo,
                'fee' => $doc->fee,
                'days' => $doc->days ?: [],
                'clinicRoom' => $doc->clinic_room,
                'timeSlots' => $doc->time_slots ?: [],
                'bio' => $doc->bio,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $doctors,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $doc = Doctor::with('department')
            ->where('slug', $id)
            ->orWhere('id', $id)
            ->first();

        if (!$doc) {
            return response()->json([
                'success' => false,
                'message' => 'Dokter tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $doc->slug ?: 'doc-' . $doc->id,
                'databaseId' => $doc->id,
                'name' => $doc->name,
                'title' => $doc->title,
                'specialty' => $doc->specialization ?: $doc->department?->name,
                'specialtyId' => $doc->department?->slug,
                'departmentId' => $doc->department_id,
                'rating' => (float) $doc->rating,
                'reviewsCount' => (int) $doc->reviews_count,
                'experience' => $doc->experience,
                'education' => $doc->education,
                'strNumber' => $doc->str_number,
                'photo' => $doc->photo,
                'fee' => $doc->fee,
                'days' => $doc->days ?: [],
                'clinicRoom' => $doc->clinic_room,
                'timeSlots' => $doc->time_slots ?: [],
                'bio' => $doc->bio,
            ],
        ]);
    }
}
