<?php

namespace App\Actions\Comercial;

use App\Models\Comercial\Compra;
use App\Models\Comercial\Oferta;
use App\Models\Identidade\Usuario;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use DomainException;

use App\Services\Comercial\MercadoPagoService;
use App\Enums\Comercial\StatusCompra;

class ProcessarCheckoutAction
{
    public function __construct(
        private readonly MercadoPagoService $mercadoPagoService
    ) {}

    public function execute(Usuario $user, int $ofertaId, array $dadosPagamento): Compra
    {

        return DB::transaction(function () use ($user, $ofertaId, $dadosPagamento) {
            $oferta = Oferta::lockForUpdate()->findOrFail($ofertaId);

            $hoje = now()->startOfDay();
            $inicioOferta = Carbon::parse($oferta->inicio)->startOfDay();
            if ($inicioOferta->lte($hoje)) {
                throw new DomainException("Não é possível comprar uma oferta que já iniciou ou que inicia hoje.");
            }

            if ($oferta->disponibilidade <= 0) {
                throw new DomainException("Esta oferta não possui mais vagas disponíveis.");
            }

            // Criar a compra como PENDENTE no banco
            $compra = Compra::create([
                'data_compra' => now(),
                'status' => StatusCompra::PENDENTE->value,
                'metodo' => $dadosPagamento['metodo'],
                'processador_pagamento' => $dadosPagamento['processador'],
                'parcelas' => $dadosPagamento['parcelas'] ?? 1,
                'valor_final' => $oferta->preco,
                'user_id' => $user->id,
                'oferta_id' => $oferta->id,
            ]);

            $preference = $this->mercadoPagoService->criarPreferencia($compra);

            $compra->update([
                'mp_preference_id' => $preference->id ?? null
            ]);
            
            $compra->payment_url = $preference->init_point ?? $preference->sandbox_init_point ?? null;

            error_log("[ProcessarCheckoutAction] Preferência Mercado Pago associada à compra. Preference ID: " . ($preference->id ?? 'null') . ", URL de redirecionamento: " . ($compra->payment_url ?? 'null'));

            return $compra;
        });
    }
}
