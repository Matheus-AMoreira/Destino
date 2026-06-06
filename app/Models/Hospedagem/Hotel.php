<?php

namespace App\Models\Hospedagem;

use Illuminate\Database\Eloquent\Model;
use App\Models\Geografia\Cidade;

class Hotel extends Model
{
    protected $table = 'hotels';

    protected $fillable = [
        'nome',
        'endereco',
        'diaria',
        'cidade_id',
        'cep',
        'cep_data',
    ];

    protected $casts = [
        'diaria' => 'integer',
        'cep_data' => 'array',
    ];

    public function cidade()
    {
        return $this->belongsTo(Cidade::class, 'cidade_id');
    }
}
