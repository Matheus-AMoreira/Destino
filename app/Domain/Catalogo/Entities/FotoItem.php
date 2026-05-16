<?php

namespace App\Domain\Catalogo\Entities;

readonly class FotoItem
{
    public function __construct(
        public int $id,
        public int $pacoteFotoId,
        public string $caminho,
        public int $ordem = 0,
        public bool $isUrl = false,
    ) {}
}
