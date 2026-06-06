<?php

namespace App\Models\Identidade;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo de log de auditoria.
 *
 * Registra ações realizadas por usuários do sistema,
 * incluindo quem fez, quem foi afetado e quais dados mudaram.
 */
class AuditLog extends Model
{
    use HasUuids;

    protected $table = 'audit_logs';

    /**
     * Não utiliza updated_at, apenas created_at.
     */
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'target_user_id',
        'action',
        'description',
        'changes',
        'ip_address',
        'user_agent',
    ];

    /**
     * Conversões de tipo dos atributos.
     */
    protected function casts(): array
    {
        return [
            'changes' => 'array',
            'created_at' => 'datetime',
        ];
    }

    /**
     * Usuário que realizou a ação (staff).
     */
    public function performer(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'user_id');
    }

    /**
     * Usuário que foi afetado pela ação.
     */
    public function target(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'target_user_id');
    }
}
