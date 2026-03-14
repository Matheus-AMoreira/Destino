<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UsuarioAuthority;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected static function booted()
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
        'id',
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
    /**
     * Get the purchases for the user.
     */
    public function compras(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Compra::class);
    }
}
