<?php

namespace App\Models\Catalogo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $table = 'tags';

    protected $fillable = ['nome'];

    public function pacotes(): BelongsToMany
    {
        return $this->belongsToMany(Pacote::class, 'pacote_tag', 'tag_id', 'pacote_id')
            ->withTimestamps();
    }
}
