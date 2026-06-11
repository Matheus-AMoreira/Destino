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
use App\Enums\Comercial\StatusCompra;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Illuminate\Support\Str;
use Mockery;

class MercadoPagoIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Pacote $pacote;
    protected Hotel $hotel;
    protected Transporte $transporte;
    protected Oferta $oferta;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AuthorizationSeeder::class);

        $this->user = User::factory()->create([
            'role_id' => DB::table('roles')->where('name', 'USUARIO')->first()->id,
            'email_verified_at' => now(),
            'cpf' => '12345678901',
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

        $this->oferta = Oferta::create([
            'id' => 201,
            'pacote_id' => $this->pacote->id,
            'hotel_id' => $this->hotel->id,
            'transporte_id' => $this->transporte->id,
            'inicio' => now()->addDays(5)->toDateString(),
            'fim' => now()->addDays(10)->toDateString(),
            'preco' => 1000,
            'disponibilidade' => 10,
            'status' => 'EMANDAMENTO'
        ]);
    }

    public function test_checkout_process_creates_pending_purchase_and_redirects_to_mercadopago()
    {
        // Mocking client to avoid actual API request
        $preferenceClientMock = Mockery::mock('overload:MercadoPago\Client\Preference\PreferenceClient');
        $preferenceClientMock->shouldReceive('create')
            ->once()
            ->andReturn((object)[
                'id' => 'test-preference-123',
                'sandbox_init_point' => 'https://sandbox.mercadopago.com.br/checkout/test-preference-123',
                'init_point' => 'https://mercadopago.com.br/checkout/test-preference-123'
            ]);

        $response = $this->actingAs($this->user)
            ->post(route('checkout.process', ['ofertaId' => $this->oferta->id]), [
                'metodo' => 'CARTAO',
                'processador' => 'MERCADOPAGO',
                'parcelas' => 1
            ], [
                'X-Inertia' => 'true'
            ]);

        // Assert response redirects to MP Sandbox
        $response->assertStatus(409); // Inertia external redirect status code
        $response->assertHeader('X-Inertia-Location', 'https://sandbox.mercadopago.com.br/checkout/test-preference-123');

        // Assert pending purchase is created
        $this->assertDatabaseHas('compras', [
            'status' => StatusCompra::PENDENTE->value,
            'valor_final' => 1000,
            'mp_preference_id' => 'test-preference-123',
            'user_id' => $this->user->id,
            'oferta_id' => $this->oferta->id,
        ]);
    }

    public function test_callback_success_updates_purchase_to_approved_and_reserves_slot()
    {
        $compra = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now(),
            'status' => StatusCompra::PENDENTE->value,
            'metodo' => 'CARTAO',
            'processador_pagamento' => 'MERCADOPAGO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $this->oferta->id,
            'mp_preference_id' => 'test-preference-123',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('checkout.success', [
                'external_reference' => $compra->id,
                'preference_id' => 'test-preference-123',
                'payment_id' => 'mp-payment-999',
                'status' => 'approved'
            ]));

        $response->assertRedirect(route('usuario.viagem.detalhes', ['id' => $compra->id]));
        $response->assertSessionHas('success', 'Pagamento aprovado com sucesso! Sua viagem está confirmada.');

        // Assert status updated to approved
        $this->assertDatabaseHas('compras', [
            'id' => $compra->id,
            'status' => StatusCompra::ACEITO->value,
            'mp_payment_id' => 'mp-payment-999',
        ]);

        // Assert availability reduced by 1 (10 -> 9)
        $this->assertEquals(9, $this->oferta->fresh()->disponibilidade);
    }

    public function test_callback_failure_updates_purchase_to_rejected()
    {
        $compra = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now(),
            'status' => StatusCompra::PENDENTE->value,
            'metodo' => 'CARTAO',
            'processador_pagamento' => 'MERCADOPAGO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $this->oferta->id,
            'mp_preference_id' => 'test-preference-123',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('checkout.failure', [
                'external_reference' => $compra->id,
                'preference_id' => 'test-preference-123',
                'payment_id' => 'mp-payment-999',
                'status' => 'rejected'
            ]));

        $response->assertRedirect(route('usuario.viagem.detalhes', ['id' => $compra->id]));
        $response->assertSessionHas('error', 'O pagamento foi recusado pelo Mercado Pago. Tente realizar a compra novamente.');

        $this->assertDatabaseHas('compras', [
            'id' => $compra->id,
            'status' => StatusCompra::RECUSADO->value,
        ]);

        // Offer availability must remain 10
        $this->assertEquals(10, $this->oferta->fresh()->disponibilidade);
    }

    public function test_webhook_receives_payment_notification_and_updates_status()
    {
        $compra = Compra::create([
            'id' => Str::uuid()->toString(),
            'data_compra' => now(),
            'status' => StatusCompra::PENDENTE->value,
            'metodo' => 'CARTAO',
            'processador_pagamento' => 'MERCADOPAGO',
            'parcelas' => 1,
            'valor_final' => 1000,
            'user_id' => $this->user->id,
            'oferta_id' => $this->oferta->id,
            'mp_preference_id' => 'test-preference-123',
        ]);

        // Mock payment client to return the payment info
        $paymentClientMock = Mockery::mock('overload:MercadoPago\Client\Payment\PaymentClient');
        $paymentClientMock->shouldReceive('get')
            ->once()
            ->with('123456789')
            ->andReturn((object)[
                'id' => '123456789',
                'status' => 'approved',
                'external_reference' => $compra->id
            ]);

        $response = $this->postJson(route('webhook.mercadopago'), [
            'type' => 'payment',
            'data' => [
                'id' => '123456789'
            ]
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Status updated and availability reduced
        $this->assertDatabaseHas('compras', [
            'id' => $compra->id,
            'status' => StatusCompra::ACEITO->value,
            'mp_payment_id' => '123456789',
        ]);
        $this->assertEquals(9, $this->oferta->fresh()->disponibilidade);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
