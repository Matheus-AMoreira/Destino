<?php

namespace App\Domain\Geografia\Entities;

readonly class Estado
{
    public function __construct(
        public int $id,
        public string $sigla,
        public string $nome,
        public ?int $regiaoId = null,
    ) {}
}
