<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Foto extends Model
{
    protected $fillable = ['nome', 'url', 'pacote_foto_id'];

    public function pacoteFoto(): BelongsTo
    {
        return $this->belongsTo(PacoteFoto::class);
    }
}
