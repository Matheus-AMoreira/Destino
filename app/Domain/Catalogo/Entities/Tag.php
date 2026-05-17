<?php

namespace App\Domain\Catalogo\Entities;

readonly class Tag
{
    public function __construct(
        public int $id,
        public string $nome,
    ) {}
}
