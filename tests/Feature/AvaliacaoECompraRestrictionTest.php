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
use App\Models\Comercial\Compra;
use App\Models\Comercial\Avaliacao;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AvaliacaoECompraRestrictionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Pacote $pacote;
    protected Hotel $hotel;
    protected Transporte $transporte;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AuthorizationSeeder::class);

        $this->user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
            'cpf' => '123.456.789-01',
            'telefone' => '11999999999',
        ]);

        Regiao::create(['id' => 1, 'nome' => 'Norte', 'sigla' => 'N']);
        Estado::create(['id' => 1, 'nome' => 'Amazonas', 'sigla' => 'AM', 'regiao_id' => 1]);
        Cidade::create(['id' => 1, 'nome' => 'Manaus', 'estado_id' => 1]);

        $this->hotel = Hotel::create([
            'id' => 1,
            'nome' => 'Hotel Teste',
            'cidade_id' => 1,
            'endereco' => 'Rua Teste',
            'estrelas' => 5,
            'diaria' => 100
        ]);

        $this->transporte = Transporte::create([
            'id' => 1,
            'empresa' => 'Empresa Teste',
            'meio' => 'AEREO',
            'preco' => 500
        ]);

        $staff = User::factory()->create(['role_id' => DB::table('roles')->where('is_staff', true)->first()->id]);

        $this->pacote = Pacote::create([
            'id' => 1,
            'nome' => 'Pacote Teste',
            'nome_slug' => 'pacote-teste',
            'descricao' => 'Descricao',
            'valor' => 1000,
            'funcionario_id' => $staff->id
        ]);
    }

    public function test_cannot_evaluate_before_trip_ends()
    {
        // Oferta que termina no futuro
        $oferta = Oferta::create([
            'id' => 101,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->addDays(5)->toDateString(),
            'fim' => now()->addDays(10)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'EMANDAMENTO'
        ]);

        $compra = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now(),
            'status' => 'ACEITO',
            'metodo' => 'PIX',
            'processador_pagamento' => 'PAGSEGURO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $oferta->id,
        ]);

        // GET avaliar should redirect with error
        $response = $this->actingAs($this->user)
            ->get(route('usuario.viagem.avaliar', ['id' => $compra->id]));
        $response->assertRedirect(route('usuario.viagem.detalhes', ['id' => $compra->id]));
        $response->assertSessionHas('error', 'Você só pode avaliar após o término da viagem.');

        // POST avaliar should redirect with error
        $response = $this->actingAs($this->user)
            ->post(route('usuario.viagem.salvar_avaliacao', ['id' => $compra->id]), [
                'nota' => 5,
                'comentario' => 'Legal',
            ]);
        $response->assertRedirect(route('usuario.viagem.detalhes', ['id' => $compra->id]));
        $response->assertSessionHas('error', 'Você só pode avaliar após o término da viagem.');
    }

    public function test_can_evaluate_after_trip_ends()
    {
        // Oferta terminada ontem
        $oferta = Oferta::create([
            'id' => 102,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->subDays(10)->toDateString(),
            'fim' => now()->subDays(1)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'CONCLUIDO'
        ]);

        $compra = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now()->subDays(10),
            'status' => 'ACEITO',
            'metodo' => 'PIX',
            'processador_pagamento' => 'PAGSEGURO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $oferta->id,
        ]);

        // GET avaliar should be allowed
        $response = $this->actingAs($this->user)
            ->get(route('usuario.viagem.avaliar', ['id' => $compra->id]));
        $response->assertStatus(200);

        // POST avaliar should succeed
        $response = $this->actingAs($this->user)
            ->post(route('usuario.viagem.salvar_avaliacao', ['id' => $compra->id]), [
                'nota' => 5,
                'comentario' => 'Viagem ótima',
            ]);
        $response->assertRedirect(route('usuario.viagem.detalhes', ['id' => $compra->id]));
        $response->assertSessionHas('success', 'Avaliação salva com sucesso!');

        $this->assertDatabaseHas('avaliacoes', [
            'compra_id' => $compra->id,
            'user_id' => $this->user->id,
            'nota' => 5,
        ]);
    }

    public function test_only_one_evaluation_per_user_per_package()
    {
        // Primeiro, criar duas ofertas passadas para o mesmo pacote
        $oferta1 = Oferta::create([
            'id' => 103,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->subDays(20)->toDateString(),
            'fim' => now()->subDays(15)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'CONCLUIDO'
        ]);

        $oferta2 = Oferta::create([
            'id' => 104,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->subDays(10)->toDateString(),
            'fim' => now()->subDays(5)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'CONCLUIDO'
        ]);

        $compra1 = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now()->subDays(20),
            'status' => 'ACEITO',
            'metodo' => 'PIX',
            'processador_pagamento' => 'PAGSEGURO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $oferta1->id,
        ]);

        $compra2 = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now()->subDays(10),
            'status' => 'ACEITO',
            'metodo' => 'PIX',
            'processador_pagamento' => 'PAGSEGURO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $oferta2->id,
        ]);

        // Avaliar a compra 1
        $this->actingAs($this->user)
            ->post(route('usuario.viagem.salvar_avaliacao', ['id' => $compra1->id]), [
                'nota' => 4,
                'comentario' => 'Muito bom',
            ]);

        // Tentar avaliar a compra 2 do mesmo pacote
        $response = $this->actingAs($this->user)
            ->get(route('usuario.viagem.avaliar', ['id' => $compra2->id]));
        $response->assertRedirect(route('usuario.viagem.detalhes', ['id' => $compra2->id]));
        $response->assertSessionHas('error', 'Você já avaliou este pacote.');

        $response = $this->actingAs($this->user)
            ->post(route('usuario.viagem.salvar_avaliacao', ['id' => $compra2->id]), [
                'nota' => 5,
                'comentario' => 'Excelente',
            ]);
        $response->assertRedirect(route('usuario.viagem.detalhes', ['id' => $compra2->id]));
        $response->assertSessionHas('error', 'Você já avaliou este pacote.');
    }

    public function test_obter_avaliacoes_shows_only_latest_offer_reviews()
    {
        // Criar duas ofertas passadas para o mesmo pacote
        $oferta1 = Oferta::create([
            'id' => 105,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->subDays(20)->toDateString(),
            'fim' => now()->subDays(15)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'CONCLUIDO'
        ]);

        $oferta2 = Oferta::create([
            'id' => 106,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->subDays(10)->toDateString(),
            'fim' => now()->subDays(5)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'CONCLUIDO'
        ]);

        // Dois usuários diferentes avaliam cada oferta (para respeitar a regra de 1 por usuário por pacote)
        $outroUser = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'cpf' => '987.654.321-09',
        ]);

        $compra1 = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now()->subDays(20),
            'status' => 'ACEITO',
            'metodo' => 'PIX',
            'processador_pagamento' => 'PAGSEGURO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $outroUser->id,
            'oferta_id' => $oferta1->id,
        ]);

        $compra2 = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now()->subDays(10),
            'status' => 'ACEITO',
            'metodo' => 'PIX',
            'processador_pagamento' => 'PAGSEGURO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $oferta2->id,
        ]);

        // Salvar avaliações
        $this->actingAs($outroUser)
            ->post(route('usuario.viagem.salvar_avaliacao', ['id' => $compra1->id]), [
                'nota' => 2,
                'comentario' => 'Ruim',
            ]);

        $this->actingAs($this->user)
            ->post(route('usuario.viagem.salvar_avaliacao', ['id' => $compra2->id]), [
                'nota' => 5,
                'comentario' => 'Maravilhoso',
            ]);

        // Obter avaliações do pacote via endpoint público
        $response = $this->get("/api/pacotes/{$this->pacote->id}/avaliacoes");
        $response->assertStatus(200);

        $data = $response->json();
        
        // Deve conter apenas a avaliação da oferta 2 (que é a última com avaliações)
        $this->assertEquals(1, $data['quantidadeAvaliacoes']);
        $this->assertEquals(5.0, $data['notaMedia']);
        $this->assertCount(1, $data['avaliacoes']);
        $this->assertEquals('Maravilhoso', $data['avaliacoes'][0]['comentario']);
    }

    public function test_cannot_purchase_package_starting_today_or_in_the_past()
    {
        // Oferta que inicia hoje
        $ofertaHoje = Oferta::create([
            'id' => 107,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->toDateString(),
            'fim' => now()->addDays(5)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'EMANDAMENTO'
        ]);

        // Oferta que inicia no passado
        $ofertaPassada = Oferta::create([
            'id' => 108,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->subDays(5)->toDateString(),
            'fim' => now()->addDays(5)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'EMANDAMENTO'
        ]);

        // Tentar acessar checkout da oferta de hoje
        $response = $this->actingAs($this->user)
            ->get(route('checkout', ['ofertaId' => $ofertaHoje->id]));
        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error', 'Esta oferta já iniciou ou inicia hoje.');

        // Tentar acessar checkout da oferta passada
        $response = $this->actingAs($this->user)
            ->get(route('checkout', ['ofertaId' => $ofertaPassada->id]));
        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error', 'Esta oferta já iniciou ou inicia hoje.');

        // Tentar processar compra diretamente via POST
        $response = $this->actingAs($this->user)
            ->post(route('checkout.process', ['ofertaId' => $ofertaHoje->id]), [
                'metodo' => 'PIX',
                'processador' => 'PAGSEGURO',
            ]);
        $response->assertRedirect();
        $response->assertSessionHas('error', 'Não é possível comprar uma oferta que já iniciou ou que inicia hoje.');
    }
}
