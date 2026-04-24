<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Hotel extends Model
{
    use LogsActivity;

    protected $fillable = ['nome', 'endereco', 'diaria', 'cidade_id'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nome', 'endereco', 'diaria'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function cidade(): BelongsTo
    {
        return $this->belongsTo(Cidade::class);
    }
}
