<?php

namespace App\Domain\Comercial\Entities;

use App\Enums\OfertaStatus;

readonly class Oferta
{
    public function __construct(
        public int $id,
        public float $preco,
        public string $inicio,
        public string $fim,
        public int $disponibilidade,
        public OfertaStatus $status,
        public bool $isAvailable,
        public int $pacoteId,
        public int $hotelId,
        public int $transporteId,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
