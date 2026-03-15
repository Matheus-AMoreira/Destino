<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Tag extends Model
{
    protected $fillable = ['nome'];

    /**
     * @return BelongsToMany<Pacote,Tag,Pivot>
     */
    public function pacotes(): BelongsToMany
    {
        return $this->belongsToMany(Pacote::class, 'pacote_tag');
    }
}
