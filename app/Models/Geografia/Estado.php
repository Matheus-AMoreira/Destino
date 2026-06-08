<?php

namespace App\Models\Geografia;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $sigla
 * @property string $nome
 * @property int|null $regiao_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Geografia\Regiao|null $regiao
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereRegiaoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereSigla($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Estado whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Estado extends Model
{
    protected $table = 'estados';
    protected $fillable = ['sigla', 'nome', 'regiao_id'];

    public function regiao()
    {
        return $this->belongsTo(Regiao::class, 'regiao_id');
    }
}
