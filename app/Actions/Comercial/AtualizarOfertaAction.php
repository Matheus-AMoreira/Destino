<?php

namespace App\Actions\Comercial;

use App\Models\Comercial\Oferta;

class AtualizarOfertaAction
{
    public function execute(Oferta $oferta, array $dados): Oferta
    {
        if (isset($dados['disponibilidade'])) {
            $dados['is_available'] = $dados['disponibilidade'] > 0;
        }
        $oferta->update($dados);
        return $oferta;
    }
}
