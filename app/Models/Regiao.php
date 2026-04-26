<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Regiao extends Model
{
    use LogsActivity;

    public $incrementing = false;

    protected $fillable = ['id', 'sigla', 'nome'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nome', 'sigla'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /**
     * @return HasMany<Estado,Regiao>
     */
    public function estados(): HasMany
    {
        return $this->hasMany(Estado::class);
    }
}
