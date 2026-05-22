<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Catalogo\PacoteService;
use App\Application\Catalogo\PacoteFotoService;
use App\Application\Identidade\UsuarioService;
use Illuminate\Routing\Controller;
use App\Application\Catalogo\PacoteService;
use App\Application\Catalogo\PacoteFotoService;
use App\Application\Identidade\UsuarioService;
use Illuminate\Routing\Controller;
use App\Http\Requests\Administracao\StorePacoteRequest;
use App\Http\Requests\Administracao\UpdatePacoteRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PacoteController extends Controller
{
    public function __construct(
        private readonly PacoteService $pacoteService,
        private readonly PacoteFotoService $fotoService,
        private readonly UsuarioService $usuarioService,
    ) {}

    public function __construct(
        private readonly PacoteService $pacoteService,
        private readonly PacoteFotoService $fotoService,
        private readonly UsuarioService $usuarioService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Administracao/Pacote/Index', [
            'pacotes' => $this->pacoteService->listarAdmin(),
            'pacotes' => $this->pacoteService->listarAdmin(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Pacote/Create', [
            'pacoteFotos' => $this->fotoService->listar(),
            'funcionarios' => $this->usuarioService->listarFuncionarios(),
            'pacoteFotos' => $this->fotoService->listar(),
            'funcionarios' => $this->usuarioService->listarFuncionarios(),
        ]);
    }

    public function store(StorePacoteRequest $request): RedirectResponse
    {
        $dados = $request->validated();
        $tagsString = $dados['tags'] ?? '';
        unset($dados['tags']);
        $dados = $request->validated();
        $tagsString = $dados['tags'] ?? '';
        unset($dados['tags']);

        $this->pacoteService->criar($dados, $tagsString);
        $this->pacoteService->criar($dados, $tagsString);

        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote criado com sucesso.');
        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote criado com sucesso.');
    }

    public function edit(int $id): Response
    public function edit(int $id): Response
    {
        $pacote = $this->pacoteService->buscarPorId($id);
        if (!$pacote) abort(404);

        $tagsString = $this->pacoteService->buscarTagsDoPacote($id);
        $pacote = $this->pacoteService->buscarPorId($id);
        if (!$pacote) abort(404);

        $tagsString = $this->pacoteService->buscarTagsDoPacote($id);

        return Inertia::render('Administracao/Pacote/Edit', [
            'pacote' => [
                'id' => $pacote->id,
                'nome' => $pacote->nome,
                'descricao' => $pacote->descricao,
                'funcionario_id' => $pacote->funcionarioId,
                'pacote_foto_id' => $pacote->pacoteFotoId,
                'tags_string' => $tagsString,
            ],
            'pacoteFotos' => $this->fotoService->listar(),
            'funcionarios' => $this->usuarioService->listarFuncionarios(),
            'pacote' => [
                'id' => $pacote->id,
                'nome' => $pacote->nome,
                'descricao' => $pacote->descricao,
                'funcionario_id' => $pacote->funcionarioId,
                'pacote_foto_id' => $pacote->pacoteFotoId,
                'tags_string' => $tagsString,
            ],
            'pacoteFotos' => $this->fotoService->listar(),
            'funcionarios' => $this->usuarioService->listarFuncionarios(),
        ]);
    }

    public function update(UpdatePacoteRequest $request, int $id): RedirectResponse
    public function update(UpdatePacoteRequest $request, int $id): RedirectResponse
    {
        $dados = $request->validated();
        $tagsString = $dados['tags'] ?? '';
        unset($dados['tags']);

        $this->pacoteService->atualizar($id, $dados, $tagsString);
        $dados = $request->validated();
        $tagsString = $dados['tags'] ?? '';
        unset($dados['tags']);

        $this->pacoteService->atualizar($id, $dados, $tagsString);

        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote atualizado com sucesso.');
        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    public function destroy(int $id): RedirectResponse
    {
        $this->pacoteService->deletar($id);
        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote deletado com sucesso.');
        $this->pacoteService->deletar($id);
        return redirect()->route('administracao.pacote.index')->with('success', 'Pacote deletado com sucesso.');
    }

    public function compras(int $pacoteId): JsonResponse
    {
        $compras = $this->pacoteService->listarComprasDoPacote($pacoteId);
        $compras = $this->pacoteService->listarComprasDoPacote($pacoteId);
        return response()->json($compras);
    }
}
