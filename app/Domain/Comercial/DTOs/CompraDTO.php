<?php

namespace App\Domain\Comercial\DTOs;

/**
 * DTO de saída para compras (viagens do usuário, confirmação checkout).
 */
readonly class CompraDTO implements \JsonSerializable
{
    public function __construct(
        public string $id,
        public string $dataCompra,
        public string $status,
        public string $metodo,
        public string $processadorPagamento,
        public int $parcelas,
        public float $valorFinal,
        public ?OfertaDTO $oferta = null,
        public ?array $avaliacao = null,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'data_compra' => $this->dataCompra,
            'status' => $this->status,
            'metodo' => $this->metodo,
            'processador_pagamento' => $this->processadorPagamento,
            'parcelas' => $this->parcelas,
            'valor_final' => $this->valorFinal,
            'oferta' => $this->oferta,
            'avaliacao' => $this->avaliacao,
        ];
    }
}
