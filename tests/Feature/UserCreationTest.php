<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_create_new_employee_with_auto_password()
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', 'ADMINISTRADOR')->first()->id
        ]);

        $roleFuncionario = Role::where('name', 'FUNCIONARIO')->first();

        $response = $this->actingAs($admin)
            ->post(route('administracao.usuario.store'), [
                'nome' => 'Novo',
                'sobre_nome' => 'Funcionario',
                'email' => 'novo@destino.com',
                'cpf' => '123.456.789-00',
                'role_id' => $roleFuncionario->id,
            ]);

        $response->assertRedirect(route('administracao.usuario.listar'));
        
        $this->assertDatabaseHas('users', [
            'email' => 'novo@destino.com',
            'is_valid' => false, // Deve começar como falso (onboarding)
        ]);

        $user = User::where('email', 'novo@destino.com')->first();
        $this->assertEquals($roleFuncionario->id, $user->role_id);
    }

    public function test_cannot_create_admin_via_api()
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', 'ADMINISTRADOR')->first()->id
        ]);

        $roleAdmin = Role::where('name', 'ADMINISTRADOR')->first();

        $response = $this->actingAs($admin)
            ->post(route('administracao.usuario.store'), [
                'nome' => 'Tentativa',
                'sobre_nome' => 'Hacker',
                'email' => 'hacker@destino.com',
                'cpf' => '000.000.000-00',
                'role_id' => $roleAdmin->id,
            ]);

        $response->assertStatus(403);
    }
}
