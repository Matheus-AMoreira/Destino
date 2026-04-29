<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Role;

try {
    $role = Role::first();
    if (!$role) {
        echo "No role found. Please seed the database.\n";
        exit;
    }

    $user = User::create([
        'nome' => 'Test',
        'sobre_nome' => 'User',
        'email' => 'test_'.time().'@example.com',
        'cpf' => '12345678901',
        'telefone' => '11999999999',
        'password' => 'Password123!',
        'role_id' => $role->id,
        'is_valid' => true,
    ]);

    echo "User created with ID: " . ($user->id ?? 'NULL') . "\n";
    echo "Is UUID? " . (Str::isUuid($user->id) ? 'Yes' : 'No') . "\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
