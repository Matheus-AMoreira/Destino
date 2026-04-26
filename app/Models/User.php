<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUuids, Notifiable, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nome', 'email', 'role_id'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    protected static function booted(): void
    {
        // 1. Regra de Promoção e Proteção de Admin
        static::saving(function (User $user) {
            $isConsole = app()->runningInConsole();

            // Bloquear promoção de Cliente para Staff via Web/API
            if (!$isConsole && $user->isDirty('role_id')) {
                $oldRole = Role::find($user->getOriginal('role_id'));
                $newRole = Role::find($user->role_id);

                // Se era cliente e tenta virar Staff, bloqueia
                if ($oldRole && !$oldRole->is_staff && $newRole->is_staff) {
                    abort(403, 'Um cliente não pode ser promovido a funcionário por segurança. Crie uma conta institucional.');
                }
            }

            // Regra do Administrador (Master Key)
            $adminRole = Role::where('name', 'ADMINISTRADOR')->first();
            if ($adminRole && $user->role_id === $adminRole->id && !$isConsole) {
                if ($user->getOriginal('role_id') !== $adminRole->id) {
                    $user->role_id = $user->getOriginal('role_id');
                }
            }
        });

        // 1b. Geração de Slug Único na Criação
        static::creating(function (User $user) {
            if (empty($user->slug)) {
                $user->slug = self::generateUniqueSlug($user->nome, $user->sobre_nome);
            }
        });

        // 1c. Atualiza o slug se o nome mudar
        static::updating(function (User $user) {
            if ($user->isDirty('nome') || $user->isDirty('sobre_nome')) {
                $user->slug = self::generateUniqueSlug($user->nome, $user->sobre_nome, $user->id);
            }
        });

        // 2. Proteção contra Deleção de Staff
        static::deleting(function (User $user) {
            if ($user->role && $user->role->is_staff) {
                abort(403, 'Funcionários não podem ser deletados para preservar o histórico do sistema. Use a função de Bloqueio.');
            }
        });
    }

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'nome',
        'sobre_nome',
        'slug',
        'cpf',
        'email',
        'telefone',
        'password',
        'is_valid',
        'role_id',
    ];

    protected $appends = [
        'name_slug',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function permissions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions');
    }

    public function hasPermission(string $slug): bool
    {
        // Implementação Singleton/Request-bound no AuthService será chamada aqui
        return app(\App\Services\AuthService::class)->isAuthorized($this, $slug);
    }

    public function compras(): HasMany
    {
        return $this->hasMany(Compra::class);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_valid' => 'boolean',
        ];
    }

    /**
     * Gera um slug único para o usuário, adicionando sufixo numérico em caso de conflito.
     */
    public static function generateUniqueSlug(string $nome, string $sobrenome, ?string $excludeId = null): string
    {
        $base = \Illuminate\Support\Str::slug("{$nome} {$sobrenome}");
        $slug = $base;
        $counter = 2;

        while (
            static::where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Slug cosmético baseado no nome (para exibição no frontend).
     * Não é garantidamente único — use o campo `slug` armazenado para roteamento.
     */
    public function getNameSlugAttribute(): string
    {
        return \Illuminate\Support\Str::slug("{$this->nome} {$this->sobre_nome}");
    }
}
