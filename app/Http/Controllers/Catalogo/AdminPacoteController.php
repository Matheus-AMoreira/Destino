<?php

namespace App\Http\Controllers\Catalogo;

use App\Models\Catalogo\Pacote;
use App\Models\Catalogo\PacoteFoto;
use App\Models\Identidade\Usuario;
use App\Http\Requests\Catalogo\CriarPacoteRequest;
use App\Http\Requests\Catalogo\AtualizarPacoteRequest;
use App\Repositories\Catalogo\PacoteRepository;
use App\Repositories\Catalogo\PacoteFotoRepository;
use App\Repositories\Identidade\UsuarioRepository;
use App\Repositories\Comercial\CompraRepository;
use App\Actions\Catalogo\CriarPacoteAction;
use App\Actions\Catalogo\AtualizarPacoteAction;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminPacoteController extends Controller
{
    public function __construct(
        private readonly PacoteRepository $pacoteRepository,
        private readonly PacoteFotoRepository $fotoRepository,
        private readonly UsuarioRepository $usuarioRepository,
        private readonly CompraRepository $compraRepository,
        private readonly CriarPacoteAction $criarAction,
        private readonly AtualizarPacoteAction $atualizarAction,
    ) {}

    public function index(): Response
    {
        $pacotes = $this->pacoteRepository->obterTodosParaAdmin();

        return Inertia::render('Administracao/Pacote/Index', [
            'pacotes' => $pacotes,
        ]);
    }

    public function create(): Response
    {
        $pacoteFotos = $this->fotoRepository->obterTodosComContagemItens();
        $funcionarios = $this->usuarioRepository->obterFuncionarios();

        return Inertia::render('Administracao/Pacote/Create', [
            'pacoteFotos' => $pacoteFotos,
            'funcionarios' => $funcionarios,
        ]);
    }

    public function store(CriarPacoteRequest $request): RedirectResponse
    {
        $this->criarAction->execute($request->validated());

        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote criado com sucesso.');
    }

    public function edit(int $id): Response
    {
        $pacote = $this->pacoteRepository->buscarPorIdParaEditar($id);
        if (!$pacote) {
            abort(404);
        }

        $tagsString = $pacote->tags->pluck('nome')->implode(', ');
        $pacoteFotos = $this->fotoRepository->obterTodosComContagemItens();
        $funcionarios = $this->usuarioRepository->obterFuncionarios();

        return Inertia::render('Administracao/Pacote/Edit', [
            'pacote' => [
                'id' => $pacote->id,
                'nome' => $pacote->nome,
                'descricao' => $pacote->descricao,
                'funcionario_id' => $pacote->funcionario_id,
                'pacote_foto_id' => $pacote->pacote_foto_id,
                'tags_string' => $tagsString,
            ],
            'pacoteFotos' => $pacoteFotos,
            'funcionarios' => $funcionarios,
        ]);
    }

    public function update(AtualizarPacoteRequest $request, int $id): RedirectResponse
    {
        $pacote = $this->pacoteRepository->buscarPorIdParaEditar($id);
        if (!$pacote) {
            abort(404);
        }

        $this->atualizarAction->execute($pacote, $request->validated());

        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $pacote = $this->pacoteRepository->buscarPorIdParaEditar($id);
        if ($pacote) {
            $pacote->delete();
        }

        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote deletado com sucesso.');
    }

    public function compras(int $pacoteId): JsonResponse
    {
        $compras = \App\Models\Comercial\Compra::with(['usuario', 'oferta.hotel.cidade'])
            ->whereHas('oferta', function($query) use ($pacoteId) {
                $query->where('pacote_id', $pacoteId);
            })
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'data_compra' => $c->data_compra->toIso8601String(),
                'status' => $c->status,
                'valor_final' => (float) $c->valor_final,
                'user' => $c->usuario ? [
                    'nome' => $c->usuario->nome,
                    'sobre_nome' => $c->usuario->sobre_nome ?? '',
                    'email' => $c->usuario->email,
                ] : null,
                'oferta' => $c->oferta ? [
                    'inicio' => $c->oferta->inicio,
                    'fim' => $c->oferta->fim,
                    'hotel' => $c->oferta->hotel ? [
                        'cidade' => $c->oferta->hotel->cidade ? [
                            'nome' => $c->oferta->hotel->cidade->nome,
                        ] : null,
                    ] : null,
                ] : null,
            ])
            ->toArray();

        return response()->json($compras);
    }
}
