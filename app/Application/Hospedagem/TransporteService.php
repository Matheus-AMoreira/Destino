<?php

namespace App\Application\Hospedagem;

use App\Application\Shared\ActivityLogService;
use App\Domain\Hospedagem\DTOs\TransporteDTO;
use App\Domain\Hospedagem\Repositories\TransporteRepositoryInterface;

class TransporteService
{
    public function __construct(
        private readonly TransporteRepositoryInterface $repo,
        private readonly ActivityLogService $log,
    ) {}

    public function buscarPorId(int $id): ?\App\Domain\Hospedagem\Entities\Transporte
    {
        return $this->repo->buscarPorId($id);
    }

    /** @return TransporteDTO[] */
    public function listarTodos(): array
    {
        $entities = $this->repo->listarTodos();
        return array_map(fn($e) => new TransporteDTO(
            id: $e->id,
            empresa: $e->empresa,
            meio: $e->meio,
            preco: $e->preco,
        ), $entities);
    }

    public function criar(array $dados): int
    {
        $id = $this->repo->criar($dados);
        $this->log->logCreated('Transporte', $id, ['empresa' => $dados['empresa']]);
        return $id;
    }

    public function atualizar(int $id, array $dados): bool
    {
        $result = $this->repo->atualizar($id, $dados);
        $this->log->logUpdated('Transporte', $id, [], $dados);
        return $result;
    }

    public function deletar(int $id): bool
    {
        $this->log->logDeleted('Transporte', $id);
        return $this->repo->deletar($id);
    }
}
