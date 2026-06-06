<?php

namespace Tests\Feature;

use App\Models\Identidade\Usuario as User;
use App\Models\Hospedagem\Hotel;
use App\Models\Geografia\Cidade;
use App\Models\Catalogo\Pacote;
use App\Models\Comercial\Oferta;
use App\Models\Geografia\Regiao;
use App\Models\Geografia\Estado;
use App\Models\Hospedagem\Transporte;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AuthorizationSeeder::class);
    }

    public function test_admin_can_access_administration_dashboard()
    {
        $admin = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'ADMINISTRADOR')->first()->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get(route('administracao.dashboard'));
        $response->assertStatus(200);
    }

    public function test_regular_user_cannot_access_administration_dashboard()
    {
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('administracao.dashboard'));
        $response->assertStatus(403);
    }

    public function test_cannot_promote_customer_to_staff()
    {
        $admin = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'ADMINISTRADOR')->first()->id,
            'email_verified_at' => now(),
        ]);

        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
        ]);

        $staffRole = DB::table('roles')->where('name', 'FUNCIONARIO')->first();

        $response = $this->actingAs($admin)->put(route('administracao.usuario.update', $user), [
            'role_id' => $staffRole->id,
        ]);

        $response->assertStatus(403);
        $this->assertNotEquals($staffRole->id, $user->fresh()->role_id);
    }

    public function test_staff_cannot_be_deleted()
    {
        $admin = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'ADMINISTRADOR')->first()->id,
            'email_verified_at' => now(),
        ]);

        $funcionario = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'FUNCIONARIO')->first()->id,
        ]);

        // Tentativa de deletar um funcionário (Deve ser bloqueado pelo modelo)
        $response = $this->actingAs($admin)->delete(route('administracao.usuario.destroy', $funcionario));
        
        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $funcionario->id]);
    }

    public function test_admin_can_create_new_staff_but_not_admin()
    {
        $admin = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'ADMINISTRADOR')->first()->id,
            'email_verified_at' => now(),
        ]);

        $staffRole = DB::table('roles')->where('name', 'FUNCIONARIO')->first();

        // Criar novo funcionário (Permitido)
        $response = $this->actingAs($admin)->post(route('administracao.usuario.store'), [
            'nome' => 'Novo',
            'sobre_nome' => 'Funcionario',
            'email' => 'novo@destino.com',
            'cpf' => '123.456.789-00',
            'telefone' => '(00) 00000-0000',
            'password' => 'password123',
            'role_id' => $staffRole->id
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'novo@destino.com', 'role_id' => $staffRole->id]);

        // Tentar criar outro Admin (Bloqueado)
        $adminRole = DB::table('roles')->where('name', 'ADMINISTRADOR')->first();
        $response = $this->actingAs($admin)->post(route('administracao.usuario.store'), [
            'nome' => 'Hack',
            'sobre_nome' => 'Admin',
            'email' => 'hack@destino.com',
            'cpf' => '111.111.111-11',
            'telefone' => '(00) 00000-0000',
            'password' => 'password123',
            'role_id' => $adminRole->id
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_access_their_own_profile_and_travels()
    {
        $user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
        ]);

        // Mock de dados para o Checkout
        Regiao::create(['id' => 1, 'nome' => 'Norte', 'sigla' => 'N']);
        Estado::create(['id' => 1, 'nome' => 'Amazonas', 'sigla' => 'AM', 'regiao_id' => 1]);
        $cidade = Cidade::create(['id' => 1, 'nome' => 'Manaus', 'estado_id' => 1]);
        
        $hotel = Hotel::create([
            'id' => 1,
            'nome' => 'Hotel Teste',
            'cidade_id' => 1,
            'endereco' => 'Rua Teste',
            'estrelas' => 5,
            'diaria' => 100
        ]);

        $staff = User::factory()->create(['role_id' => DB::table('roles')->where('is_staff', true)->first()->id]);

        $pacote = Pacote::create([
            'id' => 1,
            'nome' => 'Pacote Teste',
            'nome_slug' => 'pacote-teste',
            'descricao' => 'Descricao',
            'valor' => 1000,
            'funcionario_id' => $staff->id
        ]);

        $transporte = Transporte::create([
            'id' => 1,
            'empresa' => 'Empresa Teste',
            'meio' => 'AEREO',
            'preco' => 500
        ]);

        $oferta = Oferta::create([
            'id' => 1,
            'pacote_id' => 1,
            'hotel_id' => 1,
            'transporte_id' => 1,
            'inicio' => now()->addDays(10),
            'fim' => now()->addDays(20),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'EMANDAMENTO'
        ]);

        // Perfil
        $this->actingAs($user)->get(route('user.profile.edit'))->assertStatus(200);
        
        // Checkout
        $this->actingAs($user)->get(route('checkout', ['ofertaId' => 1]))->assertStatus(200);
    }
}
