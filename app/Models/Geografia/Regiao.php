<?php

namespace App\Models\Geografia;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $sigla
 * @property string $nome
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereSigla($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Regiao whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Regiao extends Model
{
    protected $table = 'regiaos';
    protected $fillable = ['sigla', 'nome'];
}
