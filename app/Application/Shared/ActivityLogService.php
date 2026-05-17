<?php

namespace App\Application\Shared;

use Illuminate\Support\Facades\DB;

/**
 * Serviço explícito de log de atividades (DML).
 * Substitui o LogsActivity do Spatie para todas as operações de negócio.
 * Registra: qual entidade, qual operação, quem fez e quando.
 */
class ActivityLogService
{
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
        $causerId = $causerId ?? auth()->id();

        DB::table('activity_log')->insert([
            'log_name' => 'default',
            'description' => $event,
            'subject_type' => $subjectType,
            'subject_id' => (string) $subjectId,
            'event' => $event,
            'causer_type' => $causerId ? 'App\\Models\\User' : null,
            'causer_id' => $causerId,
            'attribute_changes' => !empty($changes) ? json_encode($changes) : null,
            'properties' => !empty($changes) ? json_encode($changes) : null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
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
