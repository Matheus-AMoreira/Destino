<?php

namespace App\Application\Comercial;

use App\Application\Shared\ActivityLogService;
use App\Domain\Comercial\DTOs\OfertaAdminDTO;
use App\Domain\Comercial\Repositories\OfertaRepositoryInterface;
use App\Domain\Comercial\Enums\OfertaStatus;

class OfertaService
{
    public function __construct(
        private readonly OfertaRepositoryInterface $repo,
        private readonly ActivityLogService $log,
    ) {}

    public function buscarPorId(int $id): ?\App\Domain\Comercial\Entities\Oferta
    {
        return $this->repo->buscarPorId($id);
    }

    /** @return OfertaAdminDTO[] */
    public function listarAdmin(): array
    {
        $rows = $this->repo->listarAdmin();
        return array_map(fn($r) => new OfertaAdminDTO(
            id: $r->id,
            preco: (float) $r->preco,
            inicio: $r->inicio,
            fim: $r->fim,
            disponibilidade: $r->disponibilidade,
            status: $r->status,
            isAvailable: (bool) $r->is_available,
            pacote: ['nome' => $r->pacote_nome],
            hotel: ['nome' => $r->hotel_nome],
            transporte: ['empresa' => $r->transporte_empresa, 'meio' => $r->transporte_meio],
        ), $rows);
    }

    public function criar(array $dados): int
    {
        $id = $this->repo->criar($dados);
        $this->log->logCreated('Oferta', $id, ['preco' => $dados['preco']]);
        return $id;
    }

    public function atualizar(int $id, array $dados): bool
    {
        $result = $this->repo->atualizar($id, $dados);
        $this->log->logUpdated('Oferta', $id, [], $dados);
        return $result;
    }

    public function deletar(int $id): bool
    {
        $this->log->logDeleted('Oferta', $id);
        return $this->repo->deletar($id);
    }
}
