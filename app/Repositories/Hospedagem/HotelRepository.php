<?php

namespace App\Repositories\Hospedagem;

use App\Models\Hospedagem\Hotel;

class HotelRepository
{
    public function obterTodosParaAdmin(?string $termo = null): array
    {
        $query = Hotel::with('cidade.estado.regiao');

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                $q->where('hotels.nome', 'ilike', "%{$termo}%")
                  ->orWhere('hotels.endereco', 'ilike', "%{$termo}%")
                  ->orWhereHas('cidade', function ($cityQuery) use ($termo) {
                      $cityQuery->where('cidades.nome', 'ilike', "%{$termo}%")
                                ->orWhereHas('estado', function ($stateQuery) use ($termo) {
                                    $stateQuery->where('estados.nome', 'ilike', "%{$termo}%")
                                               ->orWhere('estados.sigla', 'ilike', "%{$termo}%")
                                               ->orWhereHas('regiao', function ($regionQuery) use ($termo) {
                                                   $regionQuery->where('regiaos.nome', 'ilike', "%{$termo}%");
                                               });
                                });
                  });
            });
        }

        return $query->get()->map(function (Hotel $h) {
            return [
                'id' => $h->id,
                'nome' => $h->nome,
                'endereco' => $h->endereco,
                'diaria' => $h->diaria,
                'cidade' => $h->cidade ? [
                    'id' => $h->cidade->id,
                    'nome' => $h->cidade->nome,
                    'estado' => [
                        'id' => $h->cidade->estado->id,
                        'nome' => $h->cidade->estado->nome,
                        'sigla' => $h->cidade->estado->sigla,
                        'regiao' => $h->cidade->estado->regiao ? [
                            'id' => $h->cidade->estado->regiao->id,
                            'nome' => $h->cidade->estado->regiao->nome,
                        ] : null,
                    ],
                ] : null,
                'cidade_id' => $h->cidade_id,
                'cep' => $h->cep,
                'cep_data' => is_string($h->cep_data) ? json_decode($h->cep_data, true) : $h->cep_data,
            ];
        })->toArray();
    }

    public function buscarPorId(int $id): ?Hotel
    {
        return Hotel::find($id);
    }
}
