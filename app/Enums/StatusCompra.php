<?php

namespace App\Enums;

enum StatusCompra: string
{
    case PENDENTE = 'PENDENTE';
    case RECUSADO = 'RECUSADO';
    case ACEITO = 'ACEITO';
}
