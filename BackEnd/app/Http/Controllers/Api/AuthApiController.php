<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthApiController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'nik' => 'required|string|min:10|max:25',
            'password' => 'required|string|min:6',
        ], [
            'name.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Alamat email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email ini sudah terdaftar sebelumnya',
            'phone.required' => 'Nomor WhatsApp / HP wajib diisi',
            'nik.required' => 'NIK KTP wajib diisi',
            'password.min' => 'Kata sandi minimal 6 karakter',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nik' => $request->nik,
            'role' => 'patient',
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran akun pasien berhasil',
            'user' => $this->formatUser($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'Alamat email wajib diisi',
            'password.required' => 'Kata sandi wajib diisi',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat email atau kata sandi tidak sesuai',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil. Selamat datang kembali, ' . $user->name,
            'user' => $this->formatUser($user),
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
