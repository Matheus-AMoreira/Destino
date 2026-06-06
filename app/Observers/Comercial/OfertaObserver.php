<?php

namespace App\Observers\Comercial;

use App\Models\Comercial\Oferta;
use App\Services\Shared\ActivityLogService;

class OfertaObserver
{
    public function __construct(private readonly ActivityLogService $log) {}

    public function created(Oferta $oferta): void
    {
        $this->log->logCreated('Oferta', $oferta->id, ['preco' => $oferta->preco]);
    }

    public function updated(Oferta $oferta): void
    {
        $dirty = $oferta->getDirty();
        unset($dirty['updated_at']);
        if (!empty($dirty)) {
            $this->log->logUpdated('Oferta', $oferta->id, [], $dirty);
        }
    }

    public function deleted(Oferta $oferta): void
    {
        $this->log->logDeleted('Oferta', $oferta->id);
    }
}
