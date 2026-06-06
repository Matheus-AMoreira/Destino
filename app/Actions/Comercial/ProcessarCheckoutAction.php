<?php

namespace App\Actions\Comercial;

use App\Models\Comercial\Compra;
use App\Models\Comercial\Oferta;
use App\Models\Identidade\Usuario;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProcessarCheckoutAction
{
    public function execute(Usuario $user, int $ofertaId, array $dadosPagamento): Compra
    {
        return DB::transaction(function () use ($user, $ofertaId, $dadosPagamento) {
            $oferta = Oferta::lockForUpdate()->findOrFail($ofertaId);

            $hoje = now()->startOfDay();
            $inicioOferta = Carbon::parse($oferta->inicio)->startOfDay();
            if ($inicioOferta->lte($hoje)) {
                throw new \DomainException("Não é possível comprar uma oferta que já iniciou ou que inicia hoje.");
            }
            
            $oferta->reservar();
            $oferta->save();

            return Compra::create([
                'data_compra' => now(),
                'status' => 'ACEITO',
                'metodo' => $dadosPagamento['metodo'],
                'processador_pagamento' => $dadosPagamento['processador'],
                'parcelas' => $dadosPagamento['parcelas'] ?? 1,
                'valor_final' => $oferta->preco,
                'user_id' => $user->id,
                'oferta_id' => $oferta->id,
            ]);
        });
    }
}
