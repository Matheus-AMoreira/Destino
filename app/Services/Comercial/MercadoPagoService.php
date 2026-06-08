<?php

namespace App\Services\Comercial;

use App\Models\Comercial\Compra;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Enums\Comercial\StatusCompra;

class MercadoPagoService
{
    public function __construct()
    {
        $accessToken = config('mercadopago.access_token');
        if ($accessToken) {
            MercadoPagoConfig::setAccessToken($accessToken);
        }
    }

    /**
     * Cria uma preferência de pagamento no Mercado Pago.
     *
     * @param Compra $compra
     * @return object
     * @throws \Exception
     */
    public function criarPreferencia(Compra $compra): object
    {
        $oferta = $compra->oferta;
        $usuario = $compra->usuario;
        $pacoteNome = $oferta->pacote->nome ?? 'Pacote de Viagem';

        $client = new PreferenceClient();

        $dadosPreferencia = [
            "items" => [
                [
                    "title" => $pacoteNome,
                    "quantity" => 1,
                    "unit_price" => (float) $compra->valor_final,
                ]
            ],
            "payer" => [
                "name" => $usuario->nome,
                "surname" => $usuario->sobre_nome,
                "email" => $usuario->email
            ],
            "back_urls" => [
                "success" => route('checkout.success'),
                "failure" => route('checkout.failure'),
                "pending" => route('checkout.pending')
            ],
            "auto_return" => "approved",
            "external_reference" => $compra->id,
        ];

        $webhookUrl = config('app.url') . '/webhook/mercadopago';
        
        if (!str_contains($webhookUrl, 'localhost') && !str_contains($webhookUrl, '127.0.0.1')) {
            $dadosPreferencia["notification_url"] = $webhookUrl;
        }

        error_log("[MercadoPagoService] Criando preferência de pagamento para a Compra ID: " . $compra->id);

        try {
            Log::info('Criando preferência de pagamento no Mercado Pago', [
                'compra_id' => $compra->id,
                'dados' => $dadosPreferencia
            ]);

            $preference = $client->create($dadosPreferencia);

            Log::info('Preferência criada com sucesso', [
                'compra_id' => $compra->id,
                'preference_id' => $preference->id ?? null
            ]);

            error_log("[MercadoPagoService] Preferência criada com sucesso no MP. Preference ID: " . ($preference->id ?? 'null') . ", Sandbox Init Point: " . ($preference->sandbox_init_point ?? 'null'));

            return $preference;
        } catch (\Exception $e) {
            Log::error('Erro ao criar preferência no Mercado Pago', [
                'compra_id' => $compra->id,
                'erro' => $e->getMessage()
            ]);
            error_log("[MercadoPagoService] Erro ao criar preferência de pagamento: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Atualiza o status da compra de forma idempotente e segura.
     * Reserva a vaga na oferta caso a compra seja aprovada.
     *
     * @param Compra $compra
     * @param string $novoStatus
     * @param string|null $paymentId
     * @return void
     */
    public function atualizarStatusCompra(Compra $compra, string $novoStatus, ?string $paymentId = null): void
    {
        error_log("[MercadoPagoService] Iniciando atualização de status da Compra ID: " . $compra->id . " para: " . $novoStatus);

        DB::transaction(function () use ($compra, $novoStatus, $paymentId) {
            $compraLock = Compra::lockForUpdate()->find($compra->id);
            if (!$compraLock) {
                return;
            }

            // Se já está aprovado, não reprocessamos
            if ($compraLock->status === StatusCompra::ACEITO->value) {
                error_log("[MercadoPagoService] Compra ID " . $compra->id . " já estava aprovada. Ignorando atualização.");
                return;
            }

            $compraLock->status = $novoStatus;
            if ($paymentId) {
                $compraLock->mp_payment_id = $paymentId;
            }
            $compraLock->save();

            error_log("[MercadoPagoService] Status da Compra ID " . $compra->id . " atualizado para " . $novoStatus);

            // Se o status mudou para aprovado, realiza a reserva da vaga
            if ($novoStatus === StatusCompra::ACEITO->value) {
                $oferta = $compraLock->oferta()->lockForUpdate()->first();
                if ($oferta) {
                    $oferta->reservar();
                    $oferta->save();
                    error_log("[MercadoPagoService] Vaga reservada com sucesso para a Oferta ID: " . $oferta->id . ". Disponibilidade atual: " . $oferta->disponibilidade);
                }
            }
        });
    }
}
