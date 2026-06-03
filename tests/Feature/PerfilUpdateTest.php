<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PerfilUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AuthorizationSeeder::class);
    }

    public function test_guest_cannot_access_profile_edit_page()
    {
        $response = $this->get(route('user.profile.edit'));
        $response->assertRedirect(route('entrar'));
    }

    public function test_authenticated_user_can_access_profile_edit_page()
    {
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('user.profile.edit'));
        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_update_profile()
    {
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
            'nome' => 'Original',
            'sobre_nome' => 'Silva',
            'email' => 'original@destino.com',
            'cpf' => Crypt::encryptString('12345678901'),
            'telefone' => '11999999999',
        ]);

        $response = $this->actingAs($user)->patch(route('user.profile.update'), [
            'nome' => 'NovoNome',
            'sobre_nome' => 'NovoSobrenome',
            'email' => 'novo@destino.com',
            'cpf' => '12345678901', // Front sends only digits
            'telefone' => '11988888888', // Front sends only digits
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $user->refresh();

        $this->assertEquals('NovoNome', $user->nome);
        $this->assertEquals('NovoSobrenome', $user->sobre_nome);
        $this->assertEquals('novo@destino.com', $user->email);
        $this->assertEquals('11988888888', $user->telefone); // clean phone
    }

    public function test_profile_update_validation_fails_with_invalid_data()
    {
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->patch(route('user.profile.update'), [
            'nome' => 'No', // too short (zod/laravel expects min:3)
            'sobre_nome' => '123', // contains numbers
            'email' => 'invalid-email',
            'cpf' => '123', // invalid length
            'telefone' => '123', // invalid length
        ]);

        $response->assertSessionHasErrors(['nome', 'sobre_nome', 'email', 'cpf', 'telefone']);
    }

    public function test_user_cannot_update_email_to_one_already_taken()
    {
        $user1 = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email' => 'user1@destino.com',
            'email_verified_at' => now(),
        ]);

        $user2 = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email' => 'user2@destino.com',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user1)->patch(route('user.profile.update'), [
            'nome' => 'User Um',
            'sobre_nome' => 'Silva',
            'email' => 'user2@destino.com', // Already taken by user2
            'cpf' => '12345678901',
            'telefone' => '11988888888',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertNotEquals('user2@destino.com', $user1->fresh()->email);
    }

    public function test_user_can_keep_their_own_email()
    {
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email' => 'user@destino.com',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->patch(route('user.profile.update'), [
            'nome' => 'NovoNome',
            'sobre_nome' => 'NovoSobrenome',
            'email' => 'user@destino.com', // keeping same email
            'cpf' => '12345678901',
            'telefone' => '11988888888',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('user@destino.com', $user->fresh()->email);
    }

    public function test_cpf_cannot_be_changed_via_profile_update()
    {
        $originalCpf = '12345678901';
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
            'cpf' => Crypt::encryptString($originalCpf),
        ]);

        $response = $this->actingAs($user)->patch(route('user.profile.update'), [
            'nome' => 'NovoNome',
            'sobre_nome' => 'NovoSobrenome',
            'email' => $user->email,
            'cpf' => '98765432109', // Attempting to change CPF
            'telefone' => '11988888888',
        ]);

        $response->assertSessionHasNoErrors();
        
        // Retrieve and decrypt CPF from database manually to ensure it didn't change
        $encryptedDbCpf = DB::table('users')->where('id', $user->id)->value('cpf');
        $decryptedDbCpf = Crypt::decryptString($encryptedDbCpf);
        
        $this->assertEquals($originalCpf, $decryptedDbCpf);
    }

    public function test_profile_update_fails_if_cpf_or_telefone_contains_formatting()
    {
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
        ]);

        // Sending formatted CPF and phone numbers
        $response = $this->actingAs($user)->patch(route('user.profile.update'), [
            'nome' => 'NovoNome',
            'sobre_nome' => 'NovoSobrenome',
            'email' => 'novo@destino.com',
            'cpf' => '123.456.789-01', // Has dots and hyphen - must be denied
            'telefone' => '(11) 98888-8888', // Has parens, space, and hyphen - must be denied
        ]);

        $response->assertSessionHasErrors(['cpf', 'telefone']);
    }
}
