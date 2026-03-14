<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\UsuarioAuthority;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasUuids;

    protected static function booted(): void
    {
        static::creating(function ($user) {
            if (empty($user->authorities)) {
                $user->authorities = match ($user->role) {
                    UserRole::ADMINISTRADOR => [UsuarioAuthority::DELETAR_USUARIO->value],
                    UserRole::FUNCIONARIO => [UsuarioAuthority::CRIAR_PACOTE->value],
                    default => [UsuarioAuthority::EDICAO_PERFIL->value],
                };
            }
        });
    }

    /**
     * Set the primary key type.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nome',
        'sobre_nome',
        'cpf',
        'email',
        'telefone',
        'password',
        'is_valid',
        'role',
        'authorities',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    /**
     * @return HasMany<Compra,Usuario>
     */
    public function compras(): HasMany
    {
        return $this->hasMany(Compra::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_valid' => 'boolean',
            'role' => UserRole::class,
            'authorities' => 'array',
        ];
    }
}
