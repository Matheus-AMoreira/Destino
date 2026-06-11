<?php

namespace App\Http\Controllers\Webhook;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use App\Models\Comercial\Compra;
use App\Services\Comercial\MercadoPagoService;
use MercadoPago\Client\Payment\PaymentClient;
use Illuminate\Support\Facades\Log;

class MercadoPagoWebhookController extends Controller
{
    public function __construct(
        private readonly MercadoPagoService $mercadoPagoService
    ) {}

    public function handle(Request $request): JsonResponse
    {
        Log::info('Webhook Mercado Pago recebido', $request->all());

        if (!$this->validarAssinatura($request)) {
            Log::warning('Webhook Mercado Pago: Assinatura x-signature inválida.');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $type = $request->input('type') ?? $request->input('resource');
        
        // O Mercado Pago pode mandar notificações com formato 'type' = 'payment'

        // ou 'action' que envolve pagamentos
        if ($type === 'payment' || $request->input('action') === 'payment.created' || $request->input('action') === 'payment.updated') {
            $paymentId = $request->input('data.id') ?? $request->input('resource.id') ?? $request->input('id');

            if (!$paymentId) {
                Log::warning('Webhook Mercado Pago: ID do pagamento não encontrado nos dados da requisição.');
                return response()->json(['error' => 'Payment ID not found'], 400);
            }

            try {
                // Instanciar o PaymentClient para buscar as informações de pagamento oficiais diretamente da API
                $paymentClient = new PaymentClient();
                $payment = $paymentClient->get($paymentId);

                if (!$payment) {
                    Log::error("Webhook Mercado Pago: Não foi possível obter o pagamento {$paymentId} da API.");
                    return response()->json(['error' => 'Payment not found in Mercado Pago API'], 404);
                }

                $compraId = $payment->external_reference;
                $status = $payment->status; // approved, pending, rejected, in_process, etc.

                Log::info("Webhook Mercado Pago processando", [
                    'payment_id' => $paymentId,
                    'compra_id' => $compraId,
                    'status' => $status
                ]);

                if (!$compraId) {
                    Log::warning("Webhook Mercado Pago: external_reference (compra_id) vazio para o pagamento {$paymentId}.");
                    return response()->json(['message' => 'No external reference'], 200);
                }

                $compra = Compra::find($compraId);
                if (!$compra) {
                    Log::error("Webhook Mercado Pago: Compra {$compraId} não encontrada no banco.");
                    return response()->json(['error' => 'Purchase not found'], 404);
                }

                // Atualizar o status de forma segura e idempotente no banco e fazer a reserva se aprovado
                $this->mercadoPagoService->atualizarStatusCompra($compra, $status, $paymentId);

                return response()->json(['success' => true], 200);
            } catch (\Exception $e) {
                Log::error('Erro ao processar webhook do Mercado Pago', [
                    'payment_id' => $paymentId,
                    'erro' => $e->getMessage()
                ]);
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }

        // Retornamos 200 para eventos não mapeados ou ignorados
        return response()->json(['message' => 'Event ignored'], 200);
    }

    private function validarAssinatura(Request $request): bool
    {
        $secret = config('mercadopago.webhook_secret');
        if (empty($secret)) {
            // Se o secret não foi configurado (ex: em ambiente local sem painel), ignoramos a checagem
            return true;
        }

        $xSignature = $request->header('x-signature');
        $xRequestId = $request->header('x-request-id');

        if (!$xSignature || !$xRequestId) {
            return false;
        }

        // Obtém o data.id que vem na URL como query param
        $dataID = $request->query('data_id') ?? $request->query('data.id') ?? $request->input('data.id', '');

        $parts = explode(',', $xSignature);
        $ts = null;
        $hash = null;

        foreach ($parts as $part) {
            $keyValue = explode('=', $part, 2);
            if (count($keyValue) == 2) {
                $key = trim($keyValue[0]);
                $value = trim($keyValue[1]);
                if ($key === 'ts') {
                    $ts = $value;
                } elseif ($key === 'v1') {
                    $hash = $value;
                }
            }
        }

        if (!$ts || !$hash) {
            return false;
        }

        $manifest = "id:{$dataID};request-id:{$xRequestId};ts:{$ts};";
        $sha = hash_hmac('sha256', $manifest, $secret);

        return hash_equals($sha, $hash);
    }
}
