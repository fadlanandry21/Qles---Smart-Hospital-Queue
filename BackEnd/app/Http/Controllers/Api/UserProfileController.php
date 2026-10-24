<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    /**
     * Get user profile by id
     */
    public function show(int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatUser($user),
        ]);
    }

    /**
     * Update user profile
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'nik' => 'sometimes|string|max:20',
            'address' => 'nullable|string',
            'gender' => 'nullable|string|in:Laki-laki,Perempuan',
            'birth_date' => 'nullable|date',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $updateData = $request->only(['name', 'phone', 'nik', 'address', 'gender', 'birth_date']);

        // Update password if provided
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'data' => $this->formatUser($user->fresh()),
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'nik' => $user->nik,
            'address' => $user->address,
            'gender' => $user->gender,
            'birthDate' => $user->birth_date,
            'role' => $user->role,
            'createdAt' => $user->created_at?->toISOString(),
        ];
    }
}
