<?php

namespace App\Application\Geografia;

use App\Domain\Geografia\DTOs\LocalizacaoDTO;
use App\Domain\Geografia\Repositories\LocalizacaoRepositoryInterface;
class LocalizacaoService
{
    public function __construct(
        private readonly LocalizacaoRepositoryInterface $repo,
    ) {}

    public function listarAgrupado(): array
    {
        // Pega todos os dados numa query só para montar o DTO hierárquico
        $rows = $this->repo->listarAgrupado();

        return array_map(fn($r) => new LocalizacaoDTO(
            cidadeId: $r->cidade_id,
            cidadeNome: $r->cidade_nome,
            estadoId: $r->estado_id,
            estadoNome: $r->estado_nome,
            estadoSigla: $r->estado_sigla,
            regiaoId: $r->regiao_id,
            regiaoNome: $r->regiao_nome,
            regiaoSigla: $r->regiao_sigla,
        ), $rows);
    }

    public function listarRegioes(): array
    {
        return $this->repo->listarRegioes();
    }

    public function listarEstados(): array
    {
        return $this->repo->listarEstados();
    }

    public function listarCidades(): array
    {
        return $this->repo->listarCidades();
    }
}
