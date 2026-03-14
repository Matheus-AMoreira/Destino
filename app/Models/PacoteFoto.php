<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PacoteFoto extends Model
{
    protected $fillable = ['nome', 'foto_do_pacote'];

    public function fotos(): HasMany
    {
        return $this->hasMany(Foto::class);
    }

    public function pacotes(): HasMany
    {
        return $this->hasMany(Pacote::class);
    }
}
