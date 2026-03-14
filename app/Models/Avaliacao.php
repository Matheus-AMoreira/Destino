<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Avaliacao extends Model
{
    protected $fillable = ['nota', 'comentario', 'data', 'user_id', 'pacote_id'];

    protected function casts(): array
    {
        return [
            'data' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pacote(): BelongsTo
    {
        return $this->belongsTo(Pacote::class);
    }
}
