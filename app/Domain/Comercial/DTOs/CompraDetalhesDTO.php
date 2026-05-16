<?php

namespace App\Domain\Comercial\DTOs;

readonly class CompraDetalhesDTO implements \JsonSerializable
{
    public function __construct(
        public string $id,
        public float $valorFinal,
        public string $status,
        public string $dataCompra,
        public string $metodo,
        public string $processadorPagamento,
        public int $parcelas,
        public array $oferta,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'valor_final' => $this->valorFinal,
            'status' => $this->status,
            'data_compra' => $this->dataCompra,
            'metodo' => $this->metodo,
            'processador_pagamento' => $this->processadorPagamento,
            'parcelas' => $this->parcelas,
            'oferta' => $this->oferta,
        ];
    }
}
