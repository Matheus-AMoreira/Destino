<?php

namespace App\Actions\Hospedagem;

use App\Models\Hospedagem\Transporte;

class CriarTransporteAction
{
    public function execute(array $dados): Transporte
    {
        return Transporte::create($dados);
    }
}
