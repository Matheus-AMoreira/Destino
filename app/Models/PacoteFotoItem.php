<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use \Illuminate\Support\Facades\Storage;

class PacoteFotoItem extends Model
{
    protected $fillable = ['pacote_foto_id', 'caminho', 'ordem', 'is_url'];

    protected $appends = ['caminho_url'];

    public function getCaminhoUrlAttribute(): string
    {
        if ($this->is_url) {
            return $this->caminho;
        }

        return $this->caminho ? Storage::url($this->caminho) : '';
    }

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
