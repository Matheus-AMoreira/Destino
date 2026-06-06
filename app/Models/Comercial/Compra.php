<?php

namespace App\Models\Comercial;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Identidade\Usuario;

class Compra extends Model
{
    use HasUuids;

    protected $table = 'compras';

    protected $fillable = [
        'data_compra',
        'status',
        'metodo',
        'processador_pagamento',
        'parcelas',
        'valor_final',
        'user_id',
        'oferta_id',
    ];

    protected $casts = [
        'valor_final' => 'float',
        'parcelas' => 'integer',
        'data_compra' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'user_id');
    }

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'oferta_id');
    }
}
