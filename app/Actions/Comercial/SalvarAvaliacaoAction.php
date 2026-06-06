<?php

namespace App\Actions\Comercial;

use App\Models\Comercial\Avaliacao;

class SalvarAvaliacaoAction
{
    public function execute(string $userId, string $compraId, int $pacoteId, int $nota, ?string $comentario): Avaliacao
    {
        $avaliacaoExistente = Avaliacao::where('compra_id', $compraId)->first();

        if ($avaliacaoExistente) {
            $avaliacaoExistente->update([
                'nota' => $nota,
                'comentario' => $comentario,
            ]);
            return $avaliacaoExistente;
        }

        return Avaliacao::create([
            'nota' => $nota,
            'comentario' => $comentario,
            'user_id' => $userId,
            'pacote_id' => $pacoteId,
            'compra_id' => $compraId,
        ]);
    }
}
