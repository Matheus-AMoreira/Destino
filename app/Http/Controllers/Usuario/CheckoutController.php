<?php

namespace App\Http\Controllers\Usuario;

use App\Application\Comercial\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
    ) {}

    public function index(int $ofertaId): Response|RedirectResponse
    {
        $dto = $this->checkoutService->buscarDetalhes($ofertaId);

        if (!$dto) {
            return redirect()->route('home')->with('error', 'Oferta não encontrada ou indisponível.');
        }

        return Inertia::render('Checkout/Index', [
            'oferta' => $dto,
        ]);
    }

    public function process(Request $request, int $ofertaId): RedirectResponse
    {
        $dadosPagamento = $request->validate([
            'metodo' => 'required|string',
            'processador' => 'required|string',
            'parcelas' => 'required_if:metodo,PARCELADO|integer|min:1',
        ]);

        try {
            $idCompra = $this->checkoutService->processarCompra(
                $request->user()->id, 
                $ofertaId, 
                $dadosPagamento
            );
            
            return redirect()->route('usuario.viagem.listar', ['usuario' => $request->user()->nome])->with('success', 'Compra realizada com sucesso!');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
