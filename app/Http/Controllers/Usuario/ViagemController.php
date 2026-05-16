<?php

namespace App\Http\Controllers\Usuario;

use App\Application\Comercial\CompraService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViagemController extends Controller
{
    public function __construct(
        private readonly CompraService $compraService,
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
}
