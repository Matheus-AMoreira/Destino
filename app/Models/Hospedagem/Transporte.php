<?php

namespace App\Models\Hospedagem;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $empresa
 * @property string $meio
 * @property int $preco
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereEmpresa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereMeio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte wherePreco($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporte whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Transporte extends Model
{
    protected $table = 'transportes';

    protected $fillable = [
        'empresa',
        'meio',
        'preco',
    ];

    protected $casts = [
        'preco' => 'integer',
    ];
}
