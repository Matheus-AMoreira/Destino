<?php

namespace App\Domain\Avaliacao\Repositories;

use App\Domain\Avaliacao\DTO\AvaliacaoRepositoryDTO;

interface AvaliacaoRepository
{
    public function save(AvaliacaoRepositoryDTO $dto): bool;

    public function findById(int $id): ?AvaliacaoRepositoryDTO;

    public function findAll(array $criteria = []): array;
}
