<?php

namespace App\Models;

use App\Enums\OfertaStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Oferta extends Model
{
    use LogsActivity;

    protected $fillable = [
        'preco',
        'inicio',
        'fim',
        'disponibilidade',
        'status',
        'pacote_id',
        'hotel_id',
        'transporte_id',
        'is_available',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['preco', 'disponibilidade', 'status'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    protected function casts(): array
    {
        return [
            'preco' => 'decimal:2',
            'inicio' => 'date',
            'fim' => 'date',
            'status' => OfertaStatus::class,
            'is_available' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Oferta $oferta) {
            $oferta->is_available = $oferta->disponibilidade > 0;
        });
    }

    /**
     * @return BelongsTo<Pacote,Oferta>
     */
    public function pacote(): BelongsTo
    {
        return $this->belongsTo(Pacote::class);
    }

    /**
     * @return BelongsTo<Hotel,Oferta>
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    /**
     * @return BelongsTo<Transporte,Oferta>
     */
    public function transporte(): BelongsTo
    {
        return $this->belongsTo(Transporte::class);
    }

    /**
     * @return HasMany<Compra,Oferta>
     */
    public function compras(): HasMany
    {
        return $this->hasMany(Compra::class);
    }
}
