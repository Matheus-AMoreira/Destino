<?php

namespace App\Models;

use App\Enums\Meio;
use Illuminate\Database\Eloquent\Model;

class Transporte extends Model
{
    protected $fillable = ['empresa', 'meio', 'preco'];

    protected function casts(): array
    {
        return [
            'meio' => Meio::class,
        ];
    }
}
