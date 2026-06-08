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
 *
 * @property string $id
 * @property string|null $user_id
 * @property string|null $target_user_id
 * @property string $action
 * @property string|null $description
 * @property array<array-key, mixed>|null $changes
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property-read \App\Models\Identidade\Usuario|null $performer
 * @property-read \App\Models\Identidade\Usuario|null $target
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereChanges($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereTargetUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUserId($value)
 * @mixin \Eloquent
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
