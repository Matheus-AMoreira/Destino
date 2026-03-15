<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Regiao extends Model
{
    public $incrementing = false;

    protected $fillable = ['id', 'sigla', 'nome'];

    /**
     * @return HasMany<Estado,Regiao>
     */
    public function estados(): HasMany
    {
        return $this->hasMany(Estado::class);
    }
}
