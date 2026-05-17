<?php

namespace App\Domain\Geografia\Entities;

readonly class Cidade
{
    public function __construct(
        public int $id,
        public string $nome,
        public int $estadoId,
    ) {}
}
