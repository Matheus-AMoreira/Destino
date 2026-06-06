<?php

namespace App\Models\Identidade;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $table = 'permissions';

    protected $fillable = [
        'slug',
        'description',
        'is_staff',
    ];

    protected $casts = [
        'is_staff' => 'boolean',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions', 'permission_id', 'role_id')
            ->withTimestamps();
    }

    public function usuarios(): BelongsToMany
    {
        return $this->belongsToMany(Usuario::class, 'user_permissions', 'permission_id', 'user_id')
            ->withTimestamps();
    }
}
