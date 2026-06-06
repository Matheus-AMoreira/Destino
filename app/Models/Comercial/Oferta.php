<?php

namespace App\Models\Comercial;

use Illuminate\Database\Eloquent\Model;
use App\Models\Catalogo\Pacote;
use App\Models\Hospedagem\Hotel;
use App\Models\Hospedagem\Transporte;

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
