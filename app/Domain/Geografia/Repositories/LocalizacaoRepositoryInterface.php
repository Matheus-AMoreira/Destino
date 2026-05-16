<?php

namespace App\Domain\Geografia\Repositories;

use App\Domain\Geografia\Entities\Regiao;
use App\Domain\Geografia\Entities\Estado;
use App\Domain\Geografia\Entities\Cidade;

interface LocalizacaoRepositoryInterface
{
    /** @return Regiao[] */
    public function listarRegioes(): array;

    /** @return Estado[] */
    public function listarEstados(): array;

    /** @return Cidade[] */
    public function listarCidades(): array;

    public function buscarRegiaoPorId(int $id): ?Regiao;
    public function buscarEstadoPorId(int $id): ?Estado;
    public function buscarCidadePorId(int $id): ?Cidade;

    public function contarCidades(): int;

    public function salvarRegiao(Regiao $regiao): void;
    public function salvarEstado(Estado $estado): void;
    public function salvarCidade(Cidade $cidade): void;
}
