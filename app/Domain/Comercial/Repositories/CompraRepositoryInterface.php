<?php

namespace App\Domain\Comercial\Repositories;

use App\Domain\Comercial\Entities\Compra;
use App\Domain\Comercial\DTOs\CompraDetalhesDTO;

interface CompraRepositoryInterface
{
    public function buscarPorId(string $id): ?Compra;
    public function listarPorUsuario(string $userId, string $view = 'andamento'): array;
    public function buscarDetalhesCompleto(string $id, string $userId): ?CompraDetalhesDTO;
    public function listarPorPacote(int $pacoteId): array;
    public function listarPorUsuarioAdmin(string $userId): array;
    public function criar(array $dados): string;

    // === Estatísticas ===
    public function comprasPorMesEStatus(int $ano): array;
    public function anosComCompras(): array;
    public function destinosPopulares(int $ano, ?int $regiaoId = null, ?int $estadoId = null): array;
    public function crescimentoUsuariosPorAno(): array;
}
