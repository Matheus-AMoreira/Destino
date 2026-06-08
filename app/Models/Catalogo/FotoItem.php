<?php

namespace App\Models\Catalogo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $pacote_foto_id
 * @property string $caminho
 * @property bool $is_url
 * @property int $ordem
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Catalogo\PacoteFoto $album
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereCaminho($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereIsUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereOrdem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem wherePacoteFotoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FotoItem whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
