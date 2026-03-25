<?php

use App\Enums\UserRole;
use App\Models\User;

test('admin routes are protected by auth and admin middleware', function () {
    $response = $this->get('/administracao/usuario/listar');

    $response->assertRedirect('/entrar');
});

test('non-admin users cannot access admin routes', function () {
    $user = User::factory()->create([
        'role' => UserRole::USUARIO,
    ]);

    $response = $this->actingAs($user)->get('/administracao/usuario/listar');

    $response->assertStatus(403);
});

test('admin users can access admin routes', function () {
    $user = User::factory()->create([
        'role' => UserRole::ADMINISTRADOR,
        'email_verified_at' => now(),
        'is_valid' => true,
    ]);

    $response = $this->actingAs($user)->get('/administracao/usuario/listar');

    $response->assertOk();
});

test('employee users can access admin routes', function () {
    $user = User::factory()->create([
        'role' => UserRole::FUNCIONARIO,
        'email_verified_at' => now(),
        'is_valid' => true,
    ]);

    $response = $this->actingAs($user)->get('/administracao/usuario/listar');

    $response->assertOk();
});
