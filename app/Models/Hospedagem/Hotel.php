<?php

namespace App\Models\Hospedagem;

use Illuminate\Database\Eloquent\Model;
use App\Models\Geografia\Cidade;

/**
 * @property int $id
 * @property string $nome
 * @property string $endereco
 * @property int $diaria
 * @property int $cidade_id
 * @property string|null $cep
 * @property array<array-key, mixed>|null $cep_data
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Cidade $cidade
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCep($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCepData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCidadeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereDiaria($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereEndereco($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hotel whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Hotel extends Model
{
    protected $table = 'hotels';

    protected $fillable = [
        'nome',
        'endereco',
        'diaria',
        'cidade_id',
        'cep',
        'cep_data',
    ];

    protected $casts = [
        'diaria' => 'integer',
        'cep_data' => 'array',
    ];

    public function cidade()
    {
        return $this->belongsTo(Cidade::class, 'cidade_id');
    }
}
