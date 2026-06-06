<?php

namespace App\Actions\Hospedagem;

use App\Models\Hospedagem\Hotel;

class CriarHotelAction
{
    public function execute(array $dados): Hotel
    {
        return Hotel::create($dados);
    }
}
