<?php

namespace App\Domain\Hospedagem\Entities;

readonly class Hotel
{
    public function __construct(
        public int $id,
        public string $nome,
        public string $endereco,
        public int $diaria,
        public int $cidadeId,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
