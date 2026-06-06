<?php

namespace App\Actions\Catalogo;

use App\Models\Catalogo\PacoteFoto;
use App\Models\Catalogo\FotoItem;
use Illuminate\Support\Facades\Storage;

class SalvarAlbumFotosAction
{
    public function execute(PacoteFoto $album, array $dados, $request): PacoteFoto
    {
        $isUrl = !empty($dados['foto_capa_url']);
        
        if ($isUrl) {
            if (!$album->is_url && $album->foto_capa) {
                Storage::disk('public')->delete($album->foto_capa);
            }
            $album->foto_capa = $dados['foto_capa_url'];
            $album->is_url = true;
            $album->storage_type = 'url';
        } elseif ($request && $request->hasFile('foto_capa_file')) {
            if (!$album->is_url && $album->foto_capa) {
                Storage::disk('public')->delete($album->foto_capa);
            }
            $album->foto_capa = $request->file('foto_capa_file')->store('pacotes/capas', 'public');
            $album->is_url = false;
            $album->storage_type = 'local';
        } elseif ($request && $request->file('foto_capa_file')) {
            $album->foto_capa = $request->file('foto_capa_file')->store('pacotes/capas', 'public');
            $album->is_url = false;
            $album->storage_type = 'local';
        }

        $album->nome = $dados['nome'] ?? $album->nome;
        $album->save();

        if (!empty($dados['itens'])) {
            foreach ($dados['itens'] as $index => $itemData) {
                if (!empty($itemData['deleted']) && !empty($itemData['id'])) {
                    $item = FotoItem::find((int) $itemData['id']);
                    if ($item) {
                        if (!$item->is_url && $item->caminho) {
                            Storage::disk('public')->delete($item->caminho);
                        }
                        $item->delete();
                    }
                    continue;
                }

                if (!empty($itemData['id'])) {
                    $item = FotoItem::find((int) $itemData['id']);
                    if ($item) {
                        $item->ordem = $index;
                        if (!empty($itemData['url'])) {
                            if (!$item->is_url && $item->caminho) {
                                Storage::disk('public')->delete($item->caminho);
                            }
                            $item->caminho = $itemData['url'];
                            $item->is_url = true;
                        } elseif (!empty($itemData['file'])) {
                            if (!$item->is_url && $item->caminho) {
                                Storage::disk('public')->delete($item->caminho);
                            }
                            $item->caminho = $itemData['file']->store('pacotes/fotos', 'public');
                            $item->is_url = false;
                        }
                        $item->save();
                    }
                    continue;
                }

                if (!empty($itemData['url'])) {
                    FotoItem::create([
                        'pacote_foto_id' => $album->id,
                        'caminho' => $itemData['url'],
                        'is_url' => true,
                        'ordem' => $index,
                    ]);
                } elseif (!empty($itemData['file'])) {
                    $caminho = $itemData['file']->store('pacotes/fotos', 'public');
                    FotoItem::create([
                        'pacote_foto_id' => $album->id,
                        'caminho' => $caminho,
                        'is_url' => false,
                        'ordem' => $index,
                    ]);
                }
            }
        }

        return $album;
    }
}
