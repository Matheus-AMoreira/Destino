<?php

namespace App\Actions\Comercial;

use App\Models\Comercial\Oferta;

class CriarOfertaAction
{
    public function execute(array $dados): Oferta
    {
        $dados['is_available'] = $dados['disponibilidade'] > 0;
        return Oferta::create($dados);
    }
}
