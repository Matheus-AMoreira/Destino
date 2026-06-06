<?php

namespace App\Repositories\Comercial;

use App\Models\Comercial\Oferta;

class OfertaRepository
{
    public function obterTodasParaAdmin(): array
    {
        return Oferta::with(['pacote', 'hotel', 'transporte'])->get()->map(function (Oferta $o) {
            return [
                'id' => $o->id,
                'preco' => (float) $o->preco,
                'inicio' => $o->inicio,
                'fim' => $o->fim,
                'disponibilidade' => $o->disponibilidade,
                'status' => $o->status,
                'is_available' => $o->disponibilidade > 0,
                'pacote' => [
                    'nome' => $o->pacote->nome ?? null,
                ],
                'hotel' => [
                    'nome' => $o->hotel->nome ?? null,
                ],
                'transporte' => [
                    'empresa' => $o->transporte->empresa ?? null,
                    'meio' => $o->transporte->meio ?? null,
                ],
            ];
        })->toArray();
    }

    public function buscarPorId(int $id): ?Oferta
    {
        return Oferta::find($id);
    }
}
