<?php

namespace App\Domain\Comercial\Repositories;

use App\Domain\Comercial\DTOs\AvaliacaoDTO;

interface AvaliacaoRepository
{
    public function save(AvaliacaoDTO $dto): bool;

    public function findById(int $id): ?AvaliacaoDTO;

    public function findAll(array $criteria = []): array;
}
