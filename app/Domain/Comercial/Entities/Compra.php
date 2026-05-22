<?php

namespace App\Domain\Comercial\Entities;

use App\Domain\Comercial\Enums\Metodo;
use App\Domain\Comercial\Enums\Processador;
use App\Domain\Comercial\Enums\StatusCompra;

readonly class Compra
{
    public function __construct(
        public string $id,
        public string $dataCompra,
        public StatusCompra $status,
        public Metodo $metodo,
        public Processador $processadorPagamento,
        public int $parcelas,
        public float $valorFinal,
        public string $userId,
        public int $ofertaId,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
