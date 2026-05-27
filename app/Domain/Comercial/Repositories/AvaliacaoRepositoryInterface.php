<?php

namespace App\Domain\Comercial\Repositories;

use App\Domain\Comercial\Entities\Avaliacao;
use App\Domain\Comercial\DTOs\AvaliacaoDTO;
use App\Domain\Comercial\DTOs\AvaliacaoPacoteDTO;

interface AvaliacaoRepositoryInterface
{
    public function criar(array $dados): int;

    public function buscarPorId(int $id): ?Avaliacao;

    public function atualizar(int $id, array $dados): bool;

    public function deletar(int $id): bool;

    public function listarPorPacote(int $pacoteId): array;

    public function listarPorUsuario(string $userId): array;

    public function jaAvaliadaPorUsuario(string $userId, int $pacoteId): bool;

    public function calcularMedia(int $pacoteId): ?float;

    public function contarAvaliacoes(int $pacoteId): int;

    public function obterAvaliacoesPacote(int $pacoteId): AvaliacaoPacoteDTO;
}
