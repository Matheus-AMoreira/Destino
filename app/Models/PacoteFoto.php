<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class PacoteFoto extends Model
{
    use LogsActivity;

    protected $fillable = ['nome', 'foto_capa', 'storage_type', 'is_url'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nome', 'foto_capa'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /**
     * @return HasMany<PacoteFotoItem,PacoteFoto>
     */
    public function fotos(): HasMany
    {
        return $this->hasMany(PacoteFotoItem::class);
    }

    protected $appends = ['foto_capa_url'];

    public function getFotoCapaUrlAttribute(): string
    {
        if ($this->is_url) {
            return $this->foto_capa;
        }

        return $this->foto_capa ? \Illuminate\Support\Facades\Storage::url($this->foto_capa) : '';
    }

    /**
     * @return HasMany<Pacote,PacoteFoto>
     */
    public function pacotes(): HasMany
    {
        return $this->hasMany(Pacote::class);
    }
}
