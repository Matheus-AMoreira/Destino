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
        // Usa query direta ou repository para buscar compras de um pacote específico
        $compras = \Illuminate\Support\Facades\DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->join('users', 'compras.user_id', '=', 'users.id')
            ->where('ofertas.pacote_id', $pacoteId)
            ->select(
                'compras.id',
                'compras.data_compra',
                'compras.status',
                'compras.valor_final',
                'users.nome as usuario_nome',
                'users.email as usuario_email'
            )
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'data_compra' => $c->data_compra,
                'status' => $c->status,
                'valor_final' => (float) $c->valor_final,
                'usuario_nome' => $c->usuario_nome,
                'usuario_email' => $c->usuario_email,
            ])
            ->toArray();

        return response()->json($compras);
    }
}
