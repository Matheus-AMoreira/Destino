<?php

namespace App\Domain\Comercial\Repositories;

use App\Domain\Comercial\Entities\Oferta;

interface OfertaRepositoryInterface
{
    public function buscarPorId(int $id): ?Oferta;
    public function listarAdmin(): array;
    public function criar(array $dados): int;
    public function atualizar(int $id, array $dados): bool;
    public function deletar(int $id): bool;
    public function contar(): int;
    public function buscarDetalhesCheckout(int $ofertaId): ?object;
}
