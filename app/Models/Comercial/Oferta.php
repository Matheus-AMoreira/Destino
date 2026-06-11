<?php

namespace App\Models\Comercial;

use Illuminate\Database\Eloquent\Model;
use App\Models\Catalogo\Pacote;
use App\Models\Hospedagem\Hotel;
use App\Models\Hospedagem\Transporte;

/**
 * @property int $id
 * @property float $preco
 * @property string $inicio
 * @property string $fim
 * @property int $disponibilidade
 * @property string $status
 * @property bool $is_available
 * @property int $pacote_id
 * @property int $hotel_id
 * @property int $transporte_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Hotel $hotel
 * @property-read Pacote $pacote
 * @property-read Transporte $transporte
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereDisponibilidade($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereFim($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereHotelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereInicio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereIsAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta wherePacoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta wherePreco($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereTransporteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Oferta extends Model
{
    protected $table = 'ofertas';

    protected $fillable = [
        'preco',
        'inicio',
        'fim',
        'disponibilidade',
        'status',
        'is_available',
        'pacote_id',
        'hotel_id',
        'transporte_id',
    ];

    protected $casts = [
        'preco' => 'float',
        'is_available' => 'boolean',
        'disponibilidade' => 'integer',
    ];

    public function pacote()
    {
        return $this->belongsTo(Pacote::class, 'pacote_id');
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id');
    }

    public function transporte()
    {
        return $this->belongsTo(Transporte::class, 'transporte_id');
    }

    public function reservar(): void
    {
        if ($this->disponibilidade <= 0) {
            throw new \DomainException("Não há vagas disponíveis para esta oferta.");
        }
        $this->disponibilidade--;
        $this->is_available = $this->disponibilidade > 0;
    }
}
