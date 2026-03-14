<?php

use App\Models\User;

test('login page is displayed', function () {
    $response = $this->get('/entrar');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/entrar', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home'));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/entrar', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});
