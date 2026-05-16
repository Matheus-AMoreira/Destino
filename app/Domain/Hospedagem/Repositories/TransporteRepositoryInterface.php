<?php

namespace App\Domain\Hospedagem\Repositories;

use App\Domain\Hospedagem\Entities\Transporte;

interface TransporteRepositoryInterface
{
    public function buscarPorId(int $id): ?Transporte;
    /** @return Transporte[] */
    public function listarTodos(): array;
    public function criar(array $dados): int;
    public function atualizar(int $id, array $dados): bool;
    public function deletar(int $id): bool;
    public function contar(): int;
}
