<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Pacote extends Model
{
    protected $fillable = ['nome', 'descricao', 'funcionario_id', 'pacote_foto_id'];
    /**
     * @return BelongsToMany<Tag,Pacote,Pivot>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'pacote_tag');
    }
    /**
     * @return HasMany<Oferta,Pacote>
     */
    public function ofertas(): HasMany
    {
        return $this->hasMany(Oferta::class);
    }
    /**
     * @return BelongsTo<Usuario,Pacote>
     */
    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'funcionario_id');
    }
    /**
     * @return BelongsTo<PacoteFoto,Pacote>
     */
    public function fotosDoPacote(): BelongsTo
    {
        return $this->belongsTo(PacoteFoto::class, 'pacote_foto_id');
    }
    /**
     * @return HasMany<Avaliacao,Pacote>
     */
    public function avaliacoes(): HasMany
    {
        return $this->hasMany(Avaliacao::class);
    }
}
