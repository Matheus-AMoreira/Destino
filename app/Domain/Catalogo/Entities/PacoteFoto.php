<?php

namespace App\Domain\Catalogo\Entities;

readonly class PacoteFoto
{
    public function __construct(
        public int $id,
        public string $nome,
        public ?string $fotoCapa = null,
        public string $storageType = 'local',
        public bool $isUrl = false,
        /** @var FotoItem[] */
        public array $fotos = [],
    ) {}
}
