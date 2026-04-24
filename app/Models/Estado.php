<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Estado extends Model
{
    use LogsActivity;

    public $incrementing = false;

    protected $fillable = ['id', 'sigla', 'nome', 'regiao_id'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nome', 'sigla'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function regiao(): BelongsTo
    {
        return $this->belongsTo(Regiao::class);
    }

    public function cidades(): HasMany
    {
        return $this->hasMany(Cidade::class);
    }
}
