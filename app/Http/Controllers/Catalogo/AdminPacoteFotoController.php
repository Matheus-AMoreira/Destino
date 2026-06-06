<?php

namespace App\Http\Controllers\Catalogo;

use App\Models\Catalogo\PacoteFoto;
use App\Http\Requests\Catalogo\StorePacoteFotoRequest;
use App\Http\Requests\Catalogo\UpdatePacoteFotoRequest;
use App\Repositories\Catalogo\PacoteFotoRepository;
use App\Actions\Catalogo\SalvarAlbumFotosAction;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminPacoteFotoController extends Controller
{
    public function __construct(
        private readonly PacoteFotoRepository $fotoRepository,
        private readonly SalvarAlbumFotosAction $salvarAction,
    ) {}

    public function index(): Response
    {
        $pacoteFotos = $this->fotoRepository->obterTodosComContagemItens();

        return Inertia::render('Administracao/PacoteFoto/Index', [
            'pacoteFotos' => $pacoteFotos,
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
        $album = new PacoteFoto();
        $this->salvarAction->execute($album, $request->validated(), $request);

        return redirect()->route('administracao.pacote-foto.index')->with('success', 'Pacote de fotos criado com sucesso.');
    }

    public function edit(int $id): Response
    {
        $album = $this->fotoRepository->buscarPorId($id);
        if (!$album) {
            abort(404);
        }

        $fotoEditData = [
            'id' => $album->id,
            'nome' => $album->nome,
            'foto_capa' => $album->is_url ? $album->foto_capa : ($album->foto_capa ? Storage::url($album->foto_capa) : ''),
            'is_url' => $album->is_url,
            'itens' => $album->items->map(fn($f) => [
                'id' => $f->id,
                'caminho_url' => $f->is_url ? $f->caminho : Storage::url($f->caminho),
                'is_url' => $f->is_url,
                'ordem' => $f->ordem,
            ])->toArray(),
        ];

        return Inertia::render('Administracao/PacoteFoto/Edit', [
            'pacoteFoto' => $fotoEditData,
            'isUploadAvailable' => config('filesystems.default') === 'local' || config('services.cloudinary.cloud_name'),
        ]);
    }

    public function update(UpdatePacoteFotoRequest $request, int $id): RedirectResponse
    {
        $album = $this->fotoRepository->buscarPorId($id);
        if (!$album) {
            abort(404);
        }

        $this->salvarAction->execute($album, $request->validated(), $request);

        return redirect()->route('administracao.pacote-foto.index')->with('success', 'Pacote de fotos atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $album = $this->fotoRepository->buscarPorId($id);
        if ($album) {
            if (!$album->is_url && $album->foto_capa) {
                Storage::disk('public')->delete($album->foto_capa);
            }
            foreach ($album->items as $item) {
                if (!$item->is_url && $item->caminho) {
                    Storage::disk('public')->delete($item->caminho);
                }
                $item->delete();
            }
            $album->delete();
        }

        return redirect()->route('administracao.pacote-foto.index')->with('success', 'Pacote de fotos deletado com sucesso.');
    }
}
