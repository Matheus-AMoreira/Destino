<?php

namespace App\Domain\Comercial\Enums;

enum Processador: string
{
    case VISA = 'VISA';
    case MASTERCARD = 'MASTERCARD';
    case UOL = 'UOL';
    case PIX = 'PIX';
}
