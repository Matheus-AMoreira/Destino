<?php

namespace App\Models\Geografia;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nome
 * @property int $estado_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Geografia\Estado $estado
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereEstadoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cidade whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Cidade extends Model
{
    protected $table = 'cidades';
    protected $fillable = ['nome', 'estado_id'];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }
}
