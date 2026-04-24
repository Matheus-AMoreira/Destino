<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administracao\StorePacoteFotoRequest;
use App\Http\Requests\Administracao\UpdatePacoteFotoRequest;
use App\Models\PacoteFoto;
use App\Models\PacoteFotoItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PacoteFotoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/PacoteFoto/Index', [
            'pacoteFotos' => PacoteFoto::withCount('fotos')->get()->map(function ($pf) {
                return [
                    'id' => $pf->id,
                    'nome' => $pf->nome,
                    'foto_capa' => $pf->foto_capa_url,
                    'storage_type' => $pf->storage_type,
                    'items_count' => $pf->fotos_count,
                ];
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/PacoteFoto/Create', [
            'isUploadAvailable' => $this->checkUploadService(),
        ]);
    }

    public function store(StorePacoteFotoRequest $request): RedirectResponse
    {
        if ($request->hasFile('foto_capa_file') && !$this->checkUploadService()) {
            return back()->withErrors(['foto_capa_file' => 'O serviço de upload não está respondendo. Verifique a configuração da API.']);
        }

        $fotoCapa = $request->foto_capa_url;
        $isUrl = true;

        if ($request->hasFile('foto_capa_file')) {
            try {
                $fotoCapa = $request->file('foto_capa_file')->store('public/pacotes');
                $isUrl = false;
            } catch (\Exception $e) {
                return back()->withErrors(['foto_capa_file' => 'Erro ao realizar upload: ' . $e->getMessage()]);
            }
        }

        $pacoteFoto = PacoteFoto::create([
            'nome' => $request->nome,
            'foto_capa' => $fotoCapa,
            'is_url' => $isUrl,
            'storage_type' => $isUrl ? 'url' : 'local',
        ]);

        if ($request->has('itens')) {
            foreach ($request->itens as $index => $item) {
                $caminho = $item['url'] ?? null;
                $itemIsUrl = true;

                if (isset($item['file']) && $item['file'] instanceof \Illuminate\Http\UploadedFile) {
                    if (!$this->checkUploadService()) {
                        continue; 
                    }
                    try {
                        $caminho = $item['file']->store('public/pacotes');
                        $itemIsUrl = false;
                    } catch (\Exception $e) {
                        continue;
                    }
                }

                if ($caminho) {
                    $pacoteFoto->fotos()->create([
                        'caminho' => $caminho,
                        'is_url' => $itemIsUrl,
                        'ordem' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('administracao.pacotedefoto.listar')
            ->with('success', 'Álbum criado com sucesso!');
    }

    public function edit(PacoteFoto $pacotedefoto): Response
    {
        $pacotedefoto->load('fotos');
        
        return Inertia::render('Administracao/PacoteFoto/Edit', [
            'pacoteFoto' => [
                'id' => $pacotedefoto->id,
                'nome' => $pacotedefoto->nome,
                'foto_capa' => $pacotedefoto->foto_capa_url,
                'is_url' => $pacotedefoto->is_url,
                'itens' => $pacotedefoto->fotos->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'caminho' => $item->caminho_url,
                        'is_url' => $item->is_url,
                    ];
                }),
            ],
            'isUploadAvailable' => $this->checkUploadService(),
        ]);
    }

    public function update(UpdatePacoteFotoRequest $request, PacoteFoto $pacotedefoto): RedirectResponse
    {
        $data = ['nome' => $request->nome];

        if ($request->hasFile('foto_capa_file') || $request->has('foto_capa_url')) {
            if ($request->hasFile('foto_capa_file')) {
                if (!$this->checkUploadService()) {
                    return back()->withErrors(['foto_capa_file' => 'O serviço de upload não está respondendo.']);
                }
                
                if (!$pacotedefoto->is_url && $pacotedefoto->foto_capa) {
                    Storage::delete($pacotedefoto->foto_capa);
                }
                
                try {
                    $data['foto_capa'] = $request->file('foto_capa_file')->store('public/pacotes');
                    $data['is_url'] = false;
                    $data['storage_type'] = 'local';
                } catch (\Exception $e) {
                    return back()->withErrors(['foto_capa_file' => 'Erro ao realizar upload: ' . $e->getMessage()]);
                }
            } else {
                if ($request->filled('foto_capa_url')) {
                    if (!$pacotedefoto->is_url && $pacotedefoto->foto_capa) {
                        Storage::delete($pacotedefoto->foto_capa);
                    }
                    $data['foto_capa'] = $request->foto_capa_url;
                    $data['is_url'] = true;
                    $data['storage_type'] = 'url';
                }
            }
        }

        $pacotedefoto->update($data);

        if ($request->has('itens')) {
            foreach ($request->itens as $index => $itemData) {
                if (isset($itemData['deleted']) && $itemData['deleted'] && isset($itemData['id'])) {
                    $item = PacoteFotoItem::find($itemData['id']);
                    if ($item) {
                        if (!$item->is_url) {
                            Storage::delete($item->caminho);
                        }
                        $item->delete();
                    }
                    continue;
                }

                if (isset($itemData['id'])) {
                    $item = PacoteFotoItem::find($itemData['id']);
                    if ($item) {
                        $updateData = ['ordem' => $index];
                        
                        // Check if image changed for existing item
                        if (isset($itemData['file']) && $itemData['file'] instanceof \Illuminate\Http\UploadedFile) {
                            if ($this->checkUploadService()) {
                                if (!$item->is_url) { Storage::delete($item->caminho); }
                                $updateData['caminho'] = $itemData['file']->store('public/pacotes');
                                $updateData['is_url'] = false;
                            }
                        } elseif (isset($itemData['url']) && $itemData['is_url']) {
                            if (!$item->is_url) { Storage::delete($item->caminho); }
                            $updateData['caminho'] = $itemData['url'];
                            $updateData['is_url'] = true;
                        }
                        
                        $item->update($updateData);
                    }
                    continue;
                }

                $caminho = $itemData['url'] ?? null;
                $itemIsUrl = true;

                if (isset($itemData['file']) && $itemData['file'] instanceof \Illuminate\Http\UploadedFile) {
                    if (!$this->checkUploadService()) {
                        continue;
                    }
                    try {
                        $caminho = $itemData['file']->store('public/pacotes');
                        $itemIsUrl = false;
                    } catch (\Exception $e) {
                        continue;
                    }
                }

                if ($caminho) {
                    $pacotedefoto->fotos()->create([
                        'caminho' => $caminho,
                        'is_url' => $itemIsUrl,
                        'ordem' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('administracao.pacotedefoto.listar')
            ->with('success', 'Álbum atualizado com sucesso!');
    }

    public function destroy(PacoteFoto $pacotedefoto): RedirectResponse
    {
        if (!$pacotedefoto->is_url && $pacotedefoto->foto_capa) {
            Storage::delete($pacotedefoto->foto_capa);
        }

        foreach ($pacotedefoto->fotos as $item) {
            if (!$item->is_url) {
                Storage::delete($item->caminho);
            }
            $item->delete();
        }

        $pacotedefoto->delete();

        return redirect()->route('administracao.pacotedefoto.listar')
            ->with('success', 'Álbum excluído com sucesso!');
    }

    private function checkUploadService(): bool
    {
        try {
            $disk = Storage::disk();
            $testFile = 'connectivity_test_' . time() . '.txt';
            
            if (!$disk->put($testFile, 'test')) {
                return false;
            }
            
            $disk->delete($testFile);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
