<?php

namespace App\Application\Shared;

use App\Domain\Shared\Repositories\ActivityLogRepositoryInterface;

/**
 * Serviço explícito de log de atividades (DML).
 * Substitui o LogsActivity do Spatie para todas as operações de negócio.
 * Registra: qual entidade, qual operação, quem fez e quando.
 */
class ActivityLogService
{
    public function __construct(
        private readonly ActivityLogRepositoryInterface $repo,
    ) {}

    /**
     * @param string $event created|updated|deleted
     * @param string $subjectType Ex: 'Pacote', 'Hotel', 'Oferta'
     * @param string|int $subjectId
     * @param array $changes ['old' => [...], 'new' => [...]] (opcional)
     */
    public function log(
        string $event,
        string $subjectType,
        string|int $subjectId,
        array $changes = [],
        ?string $causerId = null,
    ): void {
        $this->repo->registrar($event, $subjectType, $subjectId, $changes, $causerId);
    }

    public function logCreated(string $subjectType, string|int $subjectId, array $attributes = []): void
    {
        $this->log('created', $subjectType, $subjectId, ['new' => $attributes]);
    }

    public function logUpdated(string $subjectType, string|int $subjectId, array $old = [], array $new = []): void
    {
        $this->log('updated', $subjectType, $subjectId, ['old' => $old, 'new' => $new]);
    }

    public function logDeleted(string $subjectType, string|int $subjectId): void
    {
        $this->log('deleted', $subjectType, $subjectId);
    }
}
