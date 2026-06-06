<?php

namespace App\Models\Geografia;

use Illuminate\Database\Eloquent\Model;

class Cidade extends Model
{
    protected $table = 'cidades';
    protected $fillable = ['nome', 'estado_id'];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }
}
