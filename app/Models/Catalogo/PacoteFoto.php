<?php

namespace App\Models\Catalogo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PacoteFoto extends Model
{
    protected $table = 'pacote_fotos';

    protected $fillable = [
        'nome',
        'storage_type',
        'foto_capa',
        'is_url',
    ];

    protected $casts = [
        'is_url' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(FotoItem::class, 'pacote_foto_id')
            ->orderBy('ordem');
    }
}
