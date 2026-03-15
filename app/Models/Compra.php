<?php

namespace App\Models;

use App\Enums\Metodo;
use App\Enums\Processador;
use App\Enums\StatusCompra;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Compra extends Model
{
    use HasUuids;

    protected $fillable = [
        'id',
        'data_compra',
        'status',
        'metodo',
        'processador_pagamento',
        'parcelas',
        'valor_final',
        'user_id',
        'oferta_id',
    ];

    protected function casts(): array
    {
        return [
            'data_compra' => 'datetime',
            'status' => StatusCompra::class,
            'metodo' => Metodo::class,
            'processador_pagamento' => Processador::class,
            'valor_final' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Usuario,Compra>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * @return BelongsTo<Oferta,Compra>
     */
    public function oferta(): BelongsTo
    {
        return $this->belongsTo(Oferta::class);
    }
}
