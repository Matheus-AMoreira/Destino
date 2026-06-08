<?php

namespace App\Models\Comercial;

use Illuminate\Database\Eloquent\Model;
use App\Models\Identidade\Usuario;
use App\Models\Catalogo\Pacote;
use App\Models\Comercial\Oferta;
use Illuminate\Support\Facades\DB;

/**
 * @property int $id
 * @property int $nota
 * @property string|null $comentario
 * @property string $user_id
 * @property int $pacote_id
 * @property string $compra_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Comercial\Compra $compra
 * @property-read Pacote $pacote
 * @property-read Usuario $usuario
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereComentario($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereCompraId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereNota($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao wherePacoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Avaliacao whereUserId($value)
 * @mixin \Eloquent
 */
class Avaliacao extends Model
{
    protected $table = 'avaliacoes';

    protected $fillable = [
        'nota',
        'comentario',
        'user_id',
        'pacote_id',
        'compra_id',
    ];

    protected $casts = [
        'nota' => 'integer',
    ];

    protected static function booted()
    {
        static::saved(function ($avaliacao) {
            $avaliacao->atualizarMetricasPacote();
        });

        static::deleted(function ($avaliacao) {
            $avaliacao->atualizarMetricasPacote();
        });
    }

    public function atualizarMetricasPacote(): void
    {
        $pacote = $this->pacote;
        if (!$pacote) {
            return;
        }

        $ultimaOfertaId = Oferta::where('pacote_id', $pacote->id)
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('compras')
                    ->join('avaliacoes', 'compras.id', '=', 'avaliacoes.compra_id')
                    ->whereColumn('compras.oferta_id', 'ofertas.id');
            })
            ->orderByDesc('inicio')
            ->orderByDesc('id')
            ->value('id');

        if ($ultimaOfertaId) {
            $query = self::where('pacote_id', $pacote->id)
                ->whereHas('compra', function ($q) use ($ultimaOfertaId) {
                    $q->where('oferta_id', $ultimaOfertaId);
                });

            $notaMedia = $query->avg('nota') ?? 0.0;
            $total = $query->count();
        } else {
            $notaMedia = 0.0;
            $total = 0;
        }

        $pacote->update([
            'media_avaliacao' => round($notaMedia, 1),
            'total_avaliacoes' => $total,
        ]);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'user_id');
    }

    public function pacote()
    {
        return $this->belongsTo(Pacote::class, 'pacote_id');
    }

    public function compra()
    {
        return $this->belongsTo(Compra::class, 'compra_id');
    }
}

