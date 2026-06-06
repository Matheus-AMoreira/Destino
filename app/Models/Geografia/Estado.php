<?php

namespace App\Models\Geografia;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estados';
    protected $fillable = ['sigla', 'nome', 'regiao_id'];

    public function regiao()
    {
        return $this->belongsTo(Regiao::class, 'regiao_id');
    }
}
