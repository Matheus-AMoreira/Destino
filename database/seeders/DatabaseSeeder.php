<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AuthorizationSeeder::class);

        $role = \App\Models\Role::where('name', \App\Enums\UserRole::USUARIO->value)->first();

        User::factory()->create([
            'nome' => 'Test',
            'sobre_nome' => 'User',
            'email' => 'test@example.com',
            'role_id' => $role?->id,
        ]);
    }
}
