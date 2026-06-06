<?php

namespace App\Http\Controllers\Comercial;

use App\Repositories\Comercial\OfertaRepository;
use App\Actions\Comercial\ProcessarCheckoutAction;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
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

        $dto = new \App\DTOs\Comercial\CheckoutDTO(
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

    public function process(Request $request, int $ofertaId): RedirectResponse
    {
        $dadosPagamento = $request->validate([
            'metodo' => 'required|string',
            'processador' => 'required|string',
            'parcelas' => 'required_if:metodo,PARCELADO|integer|min:1',
        ]);

        $user = $request->user();
        if (empty($user->cpf) || empty($user->telefone)) {
            return back()->with('error', 'Perfil incompleto. CPF e telefone são obrigatórios para a compra.');
        }

        try {
            $this->processarAction->execute($user, $ofertaId, $dadosPagamento);

            return redirect()->route('usuario.viagem.listar', ['usuario' => $user->nome])->with('success', 'Compra realizada com sucesso!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
