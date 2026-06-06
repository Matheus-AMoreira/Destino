<?php

namespace App\Observers\Catalogo;

use App\Models\Catalogo\Pacote;
use App\Services\Shared\ActivityLogService;

class PacoteObserver
{
    public function __construct(private readonly ActivityLogService $log) {}

    public function created(Pacote $pacote): void
    {
        $this->log->logCreated('Pacote', $pacote->id, ['nome' => $pacote->nome]);
    }

    public function updated(Pacote $pacote): void
    {
        $original = $pacote->getOriginal();
        $dirty = $pacote->getDirty();
        unset($dirty['updated_at']);
        if (!empty($dirty)) {
            $old = ['nome' => $original['nome'] ?? $pacote->nome];
            $this->log->logUpdated('Pacote', $pacote->id, $old, $dirty);
        }
    }

    public function deleted(Pacote $pacote): void
    {
        $this->log->logDeleted('Pacote', $pacote->id);
    }
}
