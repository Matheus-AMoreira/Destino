<?php

namespace App\Models\Identidade;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'name',
        'description',
        'is_staff',
    ];

    protected $casts = [
        'is_staff' => 'boolean',
    ];

    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class, 'role_id');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions', 'role_id', 'permission_id')
            ->withTimestamps();
    }
}
