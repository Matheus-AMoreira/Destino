<?php

namespace App\Models\Catalogo;

use App\Models\Comercial\Oferta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Identidade\Usuario;

/**
 * @property int $id
 * @property string $nome
 * @property string $descricao
 * @property string $funcionario_id
 * @property int|null $pacote_foto_id
 * @property array<array-key, mixed>|null $tag_ids
 * @property float|null $media_avaliacao
 * @property int|null $total_avaliacoes
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Catalogo\PacoteFoto|null $album
 * @property-read Usuario $funcionario
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Oferta> $ofertas
 * @property-read int|null $ofertas_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Catalogo\Tag> $tags
 * @property-read int|null $tags_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereDescricao($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereFuncionarioId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereMediaAvaliacao($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote wherePacoteFotoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereTagIds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereTotalAvaliacoes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pacote whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
