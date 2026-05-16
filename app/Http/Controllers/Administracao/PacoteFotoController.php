<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Catalogo\PacoteFotoService;
use Illuminate\Routing\Controller;
use App\Http\Requests\Administracao\StorePacoteFotoRequest;
use App\Http\Requests\Administracao\UpdatePacoteFotoRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PacoteFotoController extends Controller
{
    public function __construct(
        private readonly PacoteFotoService $fotoService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Administracao/PacoteFoto/Index', [
            'pacoteFotos' => $this->fotoService->listar(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/PacoteFoto/Create', [
            'isUploadAvailable' => config('filesystems.default') === 'local' || config('services.cloudinary.cloud_name'),
        ]);
    }

    public function store(StorePacoteFotoRequest $request): RedirectResponse
    {
        $dados = $request->validated();
        $isUrl = !empty($dados['foto_capa_url']);
        
        $fotoCapa = $isUrl 
            ? $dados['foto_capa_url'] 
            : $request->file('foto_capa_file')->store('pacotes/capas', 'public');

        $itensProcessados = [];
        if (!empty($dados['itens'])) {
            foreach ($dados['itens'] as $item) {
                if (!empty($item['url'])) {
                    $itensProcessados[] = ['caminho' => $item['url'], 'is_url' => true];
                } elseif (!empty($item['file'])) {
                    $caminho = $item['file']->store('pacotes/fotos', 'public');
                    $itensProcessados[] = ['caminho' => $caminho, 'is_url' => false];
                }
            }
        }

        $this->fotoService->criar($dados['nome'], $fotoCapa, $isUrl, $itensProcessados);

        return redirect()->route('administracao.pacote-foto.index')->with('success', 'Pacote de fotos criado com sucesso.');
    }

    public function edit(int $id): Response
    {
        $album = $this->fotoService->buscarParaEdicao($id);
        if (!$album) abort(404);

        return Inertia::render('Administracao/PacoteFoto/Edit', [
            'pacoteFoto' => $album,
            'isUploadAvailable' => config('filesystems.default') === 'local' || config('services.cloudinary.cloud_name'),
        ]);
    }

    public function update(UpdatePacoteFotoRequest $request, int $id): RedirectResponse
    {
        $dados = $request->validated();
        $updateData = ['nome' => $dados['nome']];

        if (!empty($dados['foto_capa_url'])) {
            $updateData['foto_capa'] = $dados['foto_capa_url'];
            $updateData['is_url'] = true;
            $updateData['storage_type'] = 'url';
        } elseif ($request->hasFile('foto_capa_file')) {
            $updateData['foto_capa'] = $request->file('foto_capa_file')->store('pacotes/capas', 'public');
            $updateData['is_url'] = false;
            $updateData['storage_type'] = 'local';
        }

        $itensProcessados = [];
        if (!empty($dados['itens'])) {
            foreach ($dados['itens'] as $item) {
                $processado = ['id' => $item['id'] ?? null, 'deleted' => !empty($item['deleted'])];
                if (!$processado['deleted']) {
                    if (!empty($item['url'])) {
                        $processado['caminho'] = $item['url'];
                        $processado['is_url'] = true;
                    } elseif (!empty($item['file'])) {
                        $processado['caminho'] = $item['file']->store('pacotes/fotos', 'public');
                        $processado['is_url'] = false;
                    }
                }
                $itensProcessados[] = $processado;
            }
        }

        $this->fotoService->atualizar($id, $updateData, $itensProcessados);

        return redirect()->route('administracao.pacote-foto.index')->with('success', 'Pacote de fotos atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->fotoService->deletar($id);
        return redirect()->route('administracao.pacote-foto.index')->with('success', 'Pacote de fotos deletado com sucesso.');
    }
}
