<?php

namespace App\Models\Catalogo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $nome
 * @property string $storage_type
 * @property string $foto_capa
 * @property bool $is_url
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Catalogo\FotoItem> $items
 * @property-read int|null $items_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereFotoCapa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereIsUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereStorageType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PacoteFoto whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PacoteFoto extends Model
{
    protected $table = 'pacote_fotos';

    protected $fillable = [
        'nome',
        'storage_type',
        'foto_capa',
        'is_url',
    ];

    protected $casts = [
        'is_url' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(FotoItem::class, 'pacote_foto_id')
            ->orderBy('ordem');
    }
}
