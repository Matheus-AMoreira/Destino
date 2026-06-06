<?php

namespace App\Models\Geografia;

use Illuminate\Database\Eloquent\Model;

class Regiao extends Model
{
    protected $table = 'regiaos';
    protected $fillable = ['sigla', 'nome'];
}
