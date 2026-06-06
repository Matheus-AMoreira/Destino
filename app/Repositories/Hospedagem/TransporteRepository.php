<?php

namespace App\Repositories\Hospedagem;

use App\Models\Hospedagem\Transporte;
use Illuminate\Support\Collection;

class TransporteRepository
{
    public function obterTodos(): Collection
    {
        return Transporte::all();
    }

    public function buscarPorId(int $id): ?Transporte
    {
        return Transporte::find($id);
    }
}
