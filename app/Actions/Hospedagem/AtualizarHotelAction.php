<?php

namespace App\Actions\Hospedagem;

use App\Models\Hospedagem\Hotel;

class AtualizarHotelAction
{
    public function execute(Hotel $hotel, array $dados): Hotel
    {
        $hotel->update($dados);
        return $hotel;
    }
}
