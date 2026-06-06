<?php

namespace App\Models\Catalogo;

use App\Models\Comercial\Oferta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Identidade\Usuario;

class Pacote extends Model
{
    protected $table = 'pacotes';

    protected $fillable = [
        'nome',
        'descricao',
        'funcionario_id',
        'pacote_foto_id',
        'tag_ids',
        'media_avaliacao',
        'total_avaliacoes',
    ];

    protected $casts = [
        'tag_ids' => 'array',
        'media_avaliacao' => 'float',
        'total_avaliacoes' => 'integer',
    ];

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'funcionario_id');
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(PacoteFoto::class, 'pacote_foto_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'pacote_tag', 'pacote_id', 'tag_id')
            ->withTimestamps();
    }

    public function ofertas(): HasMany
    {
        return $this->hasMany(Oferta::class, 'pacote_id');
    }
}
