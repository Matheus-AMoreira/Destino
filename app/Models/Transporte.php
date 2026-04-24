<?php

namespace App\Models;

use App\Enums\Meio;
use Illuminate\Database\Eloquent\Model;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Transporte extends Model
{
    use LogsActivity;

    protected $fillable = ['empresa', 'meio', 'preco'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['empresa', 'meio', 'preco'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    protected function casts(): array
    {
        return [
            'meio' => Meio::class,
        ];
    }
}
