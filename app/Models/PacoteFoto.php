<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PacoteFoto extends Model
{
    protected $fillable = ['nome', 'foto_capa', 'storage_type', 'is_url'];

    /**
     * @return HasMany<Foto,PacoteFoto>
     */
    public function fotos(): HasMany
    {
        return $this->hasMany(Foto::class);
    }

    /**
     * @return HasMany<Pacote,PacoteFoto>
     */
    public function pacotes(): HasMany
    {
        return $this->hasMany(Pacote::class);
    }
}
