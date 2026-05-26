<?php

namespace App\Domain\Comercial\Entities;

readonly class Avaliacao
{
    public function __construct(
        public int $id,
        public int $nota,
        public ?string $comentario,
        public string $userId,
        public int $pacoteId,
        public string $compraId,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
