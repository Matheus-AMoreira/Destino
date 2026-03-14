<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cidade extends Model
{
    public $incrementing = false;
    protected $fillable = ['id', 'nome', 'estado_id'];

    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class);
    }

    public function hotels(): HasMany
    {
        return $this->hasMany(Hotel::class);
    }
}
