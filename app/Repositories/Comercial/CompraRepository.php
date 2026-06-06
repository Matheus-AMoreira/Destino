<?php

namespace App\Repositories\Comercial;

use App\Models\Comercial\Compra;

class CompraRepository
{
    public function obterPorUsuario(string $userId, string $view): array
    {
        return Compra::with([
            'oferta.pacote.album',
            'oferta.hotel.cidade.estado',
            'oferta.transporte',
        ])
        ->where('user_id', $userId)
        ->whereHas('oferta', function ($q) use ($view) {
            if ($view === 'concluidas') {
                $q->where('fim', '<', now());
            } else {
                $q->where('fim', '>=', now());
            }
        })
        ->latest('data_compra')
        ->get()
        ->toArray();
    }

    public function buscarPorIdParaUsuario(string $id, string $userId): ?Compra
    {
        return Compra::with([
            'oferta.pacote.album',
            'oferta.hotel.cidade.estado',
            'oferta.transporte',
        ])
        ->where('id', $id)
        ->where('user_id', $userId)
        ->first();
    }

    public function buscarPorId(string $id): ?Compra
    {
        return Compra::find($id);
    }
}
