<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PacoteFotoItem extends Model
{
    protected $fillable = ['pacote_foto_id', 'caminho', 'ordem', 'is_url'];

    protected function casts(): array
    {
        return [
            'is_url' => 'boolean',
        ];
    }

    public function pacoteFoto(): BelongsTo
    {
        return $this->belongsTo(PacoteFoto::class);
    }
}
