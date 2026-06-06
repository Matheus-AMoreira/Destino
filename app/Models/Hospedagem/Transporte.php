<?php

namespace App\Models\Hospedagem;

use Illuminate\Database\Eloquent\Model;

class Transporte extends Model
{
    protected $table = 'transportes';

    protected $fillable = [
        'empresa',
        'meio',
        'preco',
    ];

    protected $casts = [
        'preco' => 'integer',
    ];
}
