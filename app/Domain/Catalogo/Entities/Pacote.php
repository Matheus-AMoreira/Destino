<?php

namespace App\Domain\Catalogo\Entities;

readonly class Pacote
{
    public function __construct(
        public int $id,
        public string $nome,
        public string $descricao,
        public ?string $funcionarioId = null,
        public ?int $pacoteFotoId = null,
        /** @var int[] */
        public array $tagIds = [],
        public ?float $mediaAvaliacao = null,
        public ?int $totalAvaliacoes = 0,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
