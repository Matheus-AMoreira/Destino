<?php

namespace App\Application\Hospedagem;

use App\Application\Shared\ActivityLogService;
use App\Domain\Hospedagem\DTOs\HotelDTO;
use App\Domain\Hospedagem\Repositories\HotelRepositoryInterface;

class HotelService
{
    public function __construct(
        private readonly HotelRepositoryInterface $repo,
        private readonly ActivityLogService $log,
    ) {}

    public function buscarPorId(int $id): ?\App\Domain\Hospedagem\Entities\Hotel
    {
        return $this->repo->buscarPorId($id);
    }

    public function buscarDTO(int $id): ?HotelDTO
    {
        $r = $this->repo->buscarComLocalizacao($id);
        if (!$r) return null;
        return new HotelDTO(
            id: $r->id,
            nome: $r->nome,
            endereco: $r->endereco,
            diaria: $r->diaria,
            cidadeNome: $r->cidade_nome,
            estadoNome: $r->estado_nome,
            estadoSigla: $r->estado_sigla,
            regiaoNome: $r->regiao_nome,
            cidadeId: $r->cidade_id,
            estadoId: $r->estado_id,
            regiaoId: $r->regiao_id,
            cep: $r->cep ?? null,
            cepData: $r->cep_data ?? null,
        );
    }

    /** @return HotelDTO[] */
    public function listarComLocalizacao(): array
    {
        $rows = $this->repo->listarComLocalizacao();
        return array_map(fn($r) => new HotelDTO(
            id: $r->id,
            nome: $r->nome,
            endereco: $r->endereco,
            diaria: $r->diaria,
            cidadeNome: $r->cidade_nome,
            estadoNome: $r->estado_nome,
            estadoSigla: $r->estado_sigla,
            regiaoNome: $r->regiao_nome,
            cidadeId: $r->cidade_id,
            estadoId: $r->estado_id,
            regiaoId: $r->regiao_id,
            cep: $r->cep ?? null,
            cepData: $r->cep_data ?? null,
        ), $rows);
    }

    public function criar(array $dados): int
    {
        $id = $this->repo->criar($dados);
        $this->log->logCreated('Hotel', $id, ['nome' => $dados['nome']]);
        return $id;
    }

    public function atualizar(int $id, array $dados): bool
    {
        $result = $this->repo->atualizar($id, $dados);
        $this->log->logUpdated('Hotel', $id, [], $dados);
        return $result;
    }

    public function deletar(int $id): bool
    {
        $this->log->logDeleted('Hotel', $id);
        return $this->repo->deletar($id);
    }
}
