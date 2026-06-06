<?php

namespace App\Models\Catalogo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FotoItem extends Model
{
    protected $table = 'pacote_foto_items';

    protected $fillable = [
        'pacote_foto_id',
        'caminho',
        'is_url',
        'ordem',
    ];

    protected $casts = [
        'is_url' => 'boolean',
        'ordem' => 'integer',
    ];

    public function album(): BelongsTo
    {
        return $this->belongsTo(PacoteFoto::class, 'pacote_foto_id');
    }
}
