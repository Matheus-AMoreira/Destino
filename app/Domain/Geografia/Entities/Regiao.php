<?php

namespace App\Domain\Geografia\Entities;

readonly class Regiao
{
    public function __construct(
        public int $id,
        public string $sigla,
        public string $nome,
    ) {}
}
