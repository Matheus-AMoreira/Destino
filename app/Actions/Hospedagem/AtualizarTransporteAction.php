<?php

namespace App\Actions\Hospedagem;

use App\Models\Hospedagem\Transporte;

class AtualizarTransporteAction
{
    public function execute(Transporte $transporte, array $dados): Transporte
    {
        $transporte->update($dados);
        return $transporte;
    }
}
