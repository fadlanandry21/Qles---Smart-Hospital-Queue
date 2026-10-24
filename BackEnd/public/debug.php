<?php
// Quick test script to debug API
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('email', 'admin@mail.com')->first();
if ($user) {
    echo "User found: " . $user->email . "\n";
    $check = Illuminate\Support\Facades\Hash::check('admin123', $user->password);
    echo "Password match: " . ($check ? 'YES' : 'NO') . "\n";
    echo "Role: " . $user->role . "\n";
} else {
    echo "User NOT found\n";
}
