<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Foto extends Model
{
    use LogsActivity;

    protected $fillable = ['nome', 'url', 'pacote_foto_id'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nome', 'url'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function pacoteFoto(): BelongsTo
    {
        return $this->belongsTo(PacoteFoto::class);
    }
}
