<?php

namespace App\Repositories\Catalogo;

use App\Models\Catalogo\PacoteFoto;
use Illuminate\Support\Facades\Storage;

class PacoteFotoRepository
{
    public function obterTodosComContagemItens(): array
    {
        return PacoteFoto::query()
            ->withCount('items')
            ->get()
            ->map(fn(PacoteFoto $f) => [
                'id' => $f->id,
                'nome' => $f->nome,
                'foto_capa' => $f->is_url ? $f->foto_capa : ($f->foto_capa ? Storage::url($f->foto_capa) : ''),
                'storage_type' => $f->storage_type,
                'items_count' => $f->items_count,
            ])
            ->toArray();
    }

    public function buscarPorId(int $id): ?PacoteFoto
    {
        return PacoteFoto::with('items')->find($id);
    }
}
