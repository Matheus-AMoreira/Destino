<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Tag extends Model
{
    use LogsActivity;

    protected $fillable = ['nome'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nome'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /**
     * @return BelongsToMany<Pacote,Tag,Pivot>
     */
    public function pacotes(): BelongsToMany
    {
        return $this->belongsToMany(Pacote::class, 'pacote_tag');
    }
}
