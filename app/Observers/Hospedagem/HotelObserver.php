<?php

namespace App\Observers\Hospedagem;

use App\Models\Hospedagem\Hotel;
use App\Services\Shared\ActivityLogService;

class HotelObserver
{
    public function __construct(private readonly ActivityLogService $log) {}

    public function created(Hotel $hotel): void
    {
        $this->log->logCreated('Hotel', $hotel->id, ['nome' => $hotel->nome]);
    }

    public function updated(Hotel $hotel): void
    {
        $dirty = $hotel->getDirty();
        unset($dirty['updated_at']);
        if (!empty($dirty)) {
            $this->log->logUpdated('Hotel', $hotel->id, [], $dirty);
        }
    }

    public function deleted(Hotel $hotel): void
    {
        $this->log->logDeleted('Hotel', $hotel->id);
    }
}
