<?php

namespace App\Observers\Identidade;

use App\Models\Identidade\Usuario;
use App\Services\Shared\ActivityLogService;

class UsuarioObserver
{
    public function __construct(private readonly ActivityLogService $log) {}

    public function created(Usuario $usuario): void
    {
        $this->log->logCreated('Usuario', $usuario->id, ['nome' => $usuario->nome]);
    }

    public function updated(Usuario $usuario): void
    {
        $dirty = $usuario->getDirty();
        unset($dirty['updated_at']);

        if (empty($dirty)) {
            return;
        }

        if (count($dirty) === 1 && isset($dirty['is_valid'])) {
            $this->log->log('status_changed', 'Usuario', $usuario->id, $dirty);
        } else {
            $this->log->logUpdated('Usuario', $usuario->id, [], $dirty);
        }
    }

    public function deleted(Usuario $usuario): void
    {
        $this->log->logDeleted('Usuario', $usuario->id);
    }
}
