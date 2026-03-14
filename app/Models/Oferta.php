<?php

namespace App\Models;

use App\Enums\OfertaStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Oferta extends Model
{
    protected $fillable = [
        'preco',
        'inicio',
        'fim',
        'disponibilidade',
        'status',
        'pacote_id',
        'hotel_id',
        'transporte_id',
    ];

    protected function casts(): array
    {
        return [
            'preco' => 'decimal:2',
            'inicio' => 'date',
            'fim' => 'date',
            'status' => OfertaStatus::class,
        ];
    }

    public function pacote(): BelongsTo
    {
        return $this->belongsTo(Pacote::class);
    }

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function transporte(): BelongsTo
    {
        return $this->belongsTo(Transporte::class);
    }

    public function compras(): HasMany
    {
        return $this->hasMany(Compra::class);
    }
}
