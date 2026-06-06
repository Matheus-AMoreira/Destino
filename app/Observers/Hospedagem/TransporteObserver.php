<?php

namespace App\Observers\Hospedagem;

use App\Models\Hospedagem\Transporte;
use App\Services\Shared\ActivityLogService;

class TransporteObserver
{
    public function __construct(private readonly ActivityLogService $log) {}

    public function created(Transporte $transporte): void
    {
        $this->log->logCreated('Transporte', $transporte->id, ['empresa' => $transporte->empresa]);
    }

    public function updated(Transporte $transporte): void
    {
        $dirty = $transporte->getDirty();
        unset($dirty['updated_at']);
        if (!empty($dirty)) {
            $this->log->logUpdated('Transporte', $transporte->id, [], $dirty);
        }
    }

    public function deleted(Transporte $transporte): void
    {
        $this->log->logDeleted('Transporte', $transporte->id);
    }
}
