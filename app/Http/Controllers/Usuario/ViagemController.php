<?php

namespace App\Http\Controllers\Usuario;

use App\Application\Comercial\CompraService;
use App\Application\Comercial\AvaliacaoService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class ViagemController extends Controller
{
    public function __construct(
        private readonly CompraService $compraService,
        private readonly AvaliacaoService $avaliacaoService,
    ) {}

    public function index(Request $request): Response
    {
        $view = $request->input('view', 'andamento'); // 'andamento' ou 'concluidas'
        
        $viagens = $this->compraService->listarViagensDoUsuario($request->user()->id, $view);

        return Inertia::render('Usuario/Viagem/Listar', [
            'compras' => $viagens,
            'view' => $view,
        ]);
    }

    public function show(Request $request, string $id): Response|RedirectResponse
    {
        $compra = $this->compraService->buscarDetalhesDaViagem($id, $request->user()->id);

        if (!$compra) {
            return redirect()->route('usuario.viagem.listar', ['usuario' => $request->user()->nome])
                             ->with('error', 'Viagem não encontrada.');
        }

        return Inertia::render('Usuario/Viagem/Detalhes', [
            'compra' => $compra,
        ]);
    }

    public function avaliar(Request $request, string $id): Response|RedirectResponse
    {
        $compra = $this->compraService->buscarDetalhesDaViagem($id, $request->user()->id);

        if (!$compra) {
            return redirect()->route('usuario.viagem.listar', ['usuario' => $request->user()->nome])
                             ->with('error', 'Viagem não encontrada.');
        }

        // Validar se a viagem já terminou
        $fimViagem = Carbon::parse($compra->oferta['fim']);
        if ($fimViagem->isFuture()) {
            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('error', 'Você só pode avaliar após o término da viagem.');
        }

        // Buscar avaliação existente, se houver, para edição
        $avaliacaoExistente = $this->avaliacaoService->buscarPorCompra($id, $request->user()->id);

        return Inertia::render('Usuario/Viagem/Avaliar', [
            'compra' => $compra,
            'avaliacaoExistente' => $avaliacaoExistente,
        ]);
    }

    public function salvarAvaliacao(Request $request, string $id): RedirectResponse
    {
        $compra = $this->compraService->buscarDetalhesDaViagem($id, $request->user()->id);

        if (!$compra) {
            return redirect()->route('usuario.viagem.listar', ['usuario' => $request->user()->nome])
                             ->with('error', 'Viagem não encontrada.');
        }

        // Validar se a viagem já terminou
        $fimViagem = Carbon::parse($compra->oferta['fim']);
        if ($fimViagem->isFuture()) {
            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('error', 'Você só pode avaliar após o término da viagem.');
        }

        $request->validate([
            'nota' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => ['nullable', 'string', 'max:500'],
        ]);

        $avaliacaoExistente = $this->avaliacaoService->buscarPorCompra($id, $request->user()->id);

        try {
            if ($avaliacaoExistente) {
                // Atualizar
                $this->avaliacaoService->atualizar(
                    avaliacaoId: $avaliacaoExistente->id,
                    userId: $request->user()->id,
                    nota: (int) $request->input('nota'),
                    comentario: $request->input('comentario'),
                );
                $message = 'Avaliação atualizada com sucesso!';
            } else {
                // Criar
                $this->avaliacaoService->criar(
                    userId: $request->user()->id,
                    pacoteId: (int) $compra->oferta['pacote']['id'],
                    compraId: $id,
                    nota: (int) $request->input('nota'),
                    comentario: $request->input('comentario'),
                );
                $message = 'Avaliação criada com sucesso!';
            }

            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
