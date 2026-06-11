<?php

namespace App\Http\Controllers\Comercial;

use App\DTOs\Comercial\CheckoutDTO;
use App\Models\Comercial\Compra;
use App\Repositories\Comercial\OfertaRepository;
use App\Actions\Comercial\ProcessarCheckoutAction;
use App\Services\Comercial\MercadoPagoService;
use App\Enums\Comercial\StatusCompra;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly OfertaRepository $ofertaRepository,
        private readonly ProcessarCheckoutAction $processarAction,
    ) {}

    public function index(int $ofertaId): Response|RedirectResponse
    {
        $oferta = $this->ofertaRepository->buscarPorId($ofertaId);

        if (!$oferta || !$oferta->is_available) {
            return redirect()->route('home')->with('error', 'Oferta não encontrada ou indisponível.');
        }

        $hoje = now()->startOfDay();
        $inicioOferta = Carbon::parse($oferta->inicio)->startOfDay();
        if ($inicioOferta->lte($hoje)) {
            return redirect()->route('home')->with('error', 'Esta oferta já iniciou ou inicia hoje.');
        }

        $foto = $oferta->pacote?->album;
        $fotoCapa = null;
        if ($foto && $foto->foto_capa) {
            $fotoCapa = $foto->is_url ? $foto->foto_capa : Storage::url($foto->foto_capa);
        }

        $dto = new CheckoutDTO(
            ofertaId: $oferta->id,
            preco: (float) $oferta->preco,
            inicio: $oferta->inicio,
            fim: $oferta->fim,
            disponibilidade: $oferta->disponibilidade,
            pacoteNome: $oferta->pacote->nome ?? null,
            fotoCapa: $fotoCapa,
            hotelNome: $oferta->hotel->nome ?? null,
            cidadeNome: $oferta->hotel->cidade->nome ?? null,
            estadoSigla: $oferta->hotel->cidade->estado->sigla ?? null,
        );

        return Inertia::render('Checkout/Index', [
            'oferta' => $dto,
        ]);
    }

    public function process(Request $request, int $ofertaId)
    {
        $dadosPagamento = $request->validate([
            'metodo' => 'required|string',
            'processador' => 'required|string',
            'parcelas' => 'required_if:metodo,PARCELADO|integer|min:1',
        ]);

        $user = $request->user();
        if (empty($user->cpf) || empty($user->telefone)) {
            error_log("[CheckoutController] Perfil incompleto para o usuário: " . $user->email);
            return back()->with('error', 'Perfil incompleto. CPF e telefone são obrigatórios para a compra.');
        }

        error_log("[CheckoutController] Iniciando checkout para Oferta: " . $ofertaId . ", Usuário: " . $user->email);

        try {
            $compra = $this->processarAction->execute($user, $ofertaId, $dadosPagamento);

            if (isset($compra->payment_url) && $compra->payment_url) {
                error_log("[CheckoutController] Compra registrada. Redirecionando para Mercado Pago: " . $compra->payment_url);
                return Inertia::location($compra->payment_url);
            }

            error_log("[CheckoutController] Compra registrada sem URL de pagamento. ID: " . $compra->id);
            return redirect()->route('usuario.viagem.detalhes', ['id' => $compra->id])
                             ->with('success', 'Compra registrada. Realize o pagamento.');
        } catch (\Exception $e) {
            error_log("[CheckoutController] Erro no processamento do checkout: " . $e->getMessage());
            return back()->with('error', $e->getMessage());
        }
    }

    public function success(Request $request): RedirectResponse
    {
        $compraId = $request->query('external_reference');
        $paymentId = $request->query('payment_id');
        $status = $request->query('status');

        Log::info('Callback Mercado Pago - Sucesso', $request->all());
        error_log("[CheckoutController] Callback de Sucesso recebido. Compra ID: " . $compraId . ", Payment ID: " . $paymentId . ", Status: " . $status);

        if (!$compraId) {
            return redirect()->route('home')->with('error', 'Compra não identificada no retorno.');
        }

        $compra = Compra::find($compraId);
        if (!$compra) {
            error_log("[CheckoutController] Compra não encontrada no callback de Sucesso. ID: " . $compraId);
            return redirect()->route('home')->with('error', 'Compra não encontrada.');
        }

        if ($status === 'approved') {
            app(MercadoPagoService::class)->atualizarStatusCompra($compra, StatusCompra::ACEITO->value, $paymentId);
            error_log("[CheckoutController] Compra ID " . $compraId . " aprovada com sucesso.");
            return redirect()->route('usuario.viagem.detalhes', ['id' => $compra->id])
                             ->with('success', 'Pagamento aprovado com sucesso! Sua viagem está confirmada.');
        }

        error_log("[CheckoutController] Compra ID " . $compraId . " com status não-aprovado no sucesso callback: " . $status);
        return redirect()->route('usuario.viagem.detalhes', ['id' => $compra->id])
                         ->with('warning', 'O status do pagamento está como: ' . ($status ?? 'pendente'));
    }

    public function failure(Request $request): RedirectResponse
    {
        $compraId = $request->query('external_reference');
        $paymentId = $request->query('payment_id');

        Log::warning('Callback Mercado Pago - Falha', $request->all());
        error_log("[CheckoutController] Callback de Falha recebido. Compra ID: " . $compraId . ", Payment ID: " . $paymentId);

        if (!$compraId) {
            return redirect()->route('home')->with('error', 'Pagamento recusado e compra não identificada.');
        }

        $compra = Compra::find($compraId);
        if ($compra) {
            app(MercadoPagoService::class)->atualizarStatusCompra($compra, StatusCompra::RECUSADO->value, $paymentId);
            error_log("[CheckoutController] Compra ID " . $compraId . " marcada como recusada.");
            return redirect()->route('usuario.viagem.detalhes', ['id' => $compra->id])
                             ->with('error', 'O pagamento foi recusado pelo Mercado Pago. Tente realizar a compra novamente.');
        }

        return redirect()->route('home')->with('error', 'Pagamento recusado.');
    }

    public function pending(Request $request): RedirectResponse
    {
        $compraId = $request->query('external_reference');
        $paymentId = $request->query('payment_id');

        Log::info('Callback Mercado Pago - Pendente', $request->all());
        error_log("[CheckoutController] Callback de Pendente recebido. Compra ID: " . $compraId . ", Payment ID: " . $paymentId);

        if (!$compraId) {
            return redirect()->route('home')->with('error', 'Compra não identificada.');
        }

        $compra = Compra::find($compraId);
        if ($compra) {
            app(MercadoPagoService::class)->atualizarStatusCompra($compra, StatusCompra::PENDENTE->value, $paymentId);
            error_log("[CheckoutController] Compra ID " . $compraId . " marcada como pendente.");
            return redirect()->route('usuario.viagem.detalhes', ['id' => $compra->id])
                             ->with('warning', 'O pagamento está pendente de processamento. Acompanhe o status nesta página.');
        }

        return redirect()->route('home')->with('warning', 'Pagamento pendente.');
    }
}
