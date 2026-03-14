<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estado extends Model
{
    public $incrementing = false;
    protected $fillable = ['id', 'sigla', 'nome', 'regiao_id'];

    public function regiao(): BelongsTo
    {
        return $this->belongsTo(Regiao::class);
    }

    public function cidades(): HasMany
    {
        return $this->hasMany(Cidade::class);
    }
}
