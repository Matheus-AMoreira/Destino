<?php

namespace App\Domain\Hospedagem\Entities;

use App\Domain\Hospedagem\Enums\Meio;

readonly class Transporte
{
    public function __construct(
        public int $id,
        public string $empresa,
        public Meio $meio,
        public int $preco,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
