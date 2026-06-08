<?php

namespace App\Models\Comercial;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Identidade\Usuario;

/**
 * @property string $id
 * @property \Carbon\CarbonImmutable $data_compra
 * @property string $status
 * @property string $metodo
 * @property string $processador_pagamento
 * @property int $parcelas
 * @property float $valor_final
 * @property string $user_id
 * @property int $oferta_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property string|null $mp_preference_id
 * @property string|null $mp_payment_id
 * @property-read \App\Models\Comercial\Oferta $oferta
 * @property-read Usuario $usuario
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereDataCompra($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereMetodo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereMpPaymentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereMpPreferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereOfertaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereParcelas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereProcessadorPagamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Compra whereValorFinal($value)
 * @mixin \Eloquent
 */
class Compra extends Model
{
    use HasUuids;

    protected $table = 'compras';

    protected $fillable = [
        'data_compra',
        'status',
        'metodo',
        'processador_pagamento',
        'parcelas',
        'valor_final',
        'user_id',
        'oferta_id',
        'mp_preference_id',
        'mp_payment_id',
    ];

    protected $casts = [
        'valor_final' => 'float',
        'parcelas' => 'integer',
        'data_compra' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'user_id');
    }

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'oferta_id');
    }
}
