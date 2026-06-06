<?php

namespace App\Models\Identidade;

use App\Services\Identidade\AuthService;
use App\Casts\CpfCast;
use Crypt;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Usuario extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasUuids;

    protected $table = 'users';

    protected $fillable = [
        'nome',
        'sobre_nome',
        'telefone',
        'cpf',
        'email',
        'password',
        'is_valid',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'cpf',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_valid' => 'boolean',
            'cpf' => CpfCast::class,
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Usuario $usuario) {
            if (empty($usuario->slug)) {
                $baseSlug = Str::slug("{$usuario->nome} {$usuario->sobre_nome}");
                $slug = $baseSlug;
                $counter = 2;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$counter}";
                    $counter++;
                }
                $usuario->slug = $slug;
            }
        });
    }

    public function hasPermission(string $permissionSlug): bool
    {
        return app(AuthService::class)->isAuthorized($this->id, $permissionSlug);
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions', 'user_id', 'permission_id')
            ->withTimestamps();
    }

    public static function encryptId(string $id): string
    {
        $encrypted = Crypt::encryptString($id);
        return str_replace(['+', '/', '='], ['-', '_', ''], $encrypted);
    }

    public static function decryptId(string $encrypted): string
    {
        try {
            $base64 = str_replace(['-', '_'], ['+', '/'], $encrypted);
            $padding = strlen($base64) % 4;
            if ($padding > 0) {
                $base64 .= str_repeat('=', 4 - $padding);
            }
            return Crypt::decryptString($base64);
        } catch (\Exception) {
            $decoded = base64_decode($encrypted, true);
            return ($decoded !== false) ? $decoded : $encrypted;
        }
    }

    protected static function newFactory()
    {
        return UserFactory::new();
    }
}
