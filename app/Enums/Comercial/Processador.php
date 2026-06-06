<?php

namespace App\Enums\Comercial;

enum Processador: string
{
    case VISA = 'VISA';
    case MASTERCARD = 'MASTERCARD';
    case UOL = 'UOL';
    case PIX = 'PIX';
}
