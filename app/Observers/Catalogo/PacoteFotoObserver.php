<?php

namespace App\Observers\Catalogo;

use App\Models\Catalogo\PacoteFoto;
use App\Services\Shared\ActivityLogService;

class PacoteFotoObserver
{
    public function __construct(private readonly ActivityLogService $log) {}

    public function created(PacoteFoto $album): void
    {
        $this->log->logCreated('PacoteFoto', $album->id, ['nome' => $album->nome]);
    }

    public function updated(PacoteFoto $album): void
    {
        $dirty = $album->getDirty();
        unset($dirty['updated_at']);
        if (!empty($dirty)) {
            $this->log->logUpdated('PacoteFoto', $album->id, [], ['nome' => $album->nome]);
        }
    }

    public function deleted(PacoteFoto $album): void
    {
        $this->log->logDeleted('PacoteFoto', $album->id);
    }
}
