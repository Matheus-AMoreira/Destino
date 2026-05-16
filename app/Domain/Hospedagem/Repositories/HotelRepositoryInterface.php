<?php

namespace App\Domain\Hospedagem\Repositories;

use App\Domain\Hospedagem\Entities\Hotel;

interface HotelRepositoryInterface
{
    public function buscarPorId(int $id): ?Hotel;
    public function listarComLocalizacao(): array;
    public function criar(array $dados): int;
    public function atualizar(int $id, array $dados): bool;
    public function deletar(int $id): bool;
    public function contar(): int;
}
