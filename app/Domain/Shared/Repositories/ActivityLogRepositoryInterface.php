<?php

namespace App\Domain\Shared\Repositories;

interface ActivityLogRepositoryInterface
{
    public function registrar(string $event, string $subjectType, string|int $subjectId, array $changes = [], ?string $causerId = null): void;
    public function listarRecentes(int $limit = 5): array;
}
