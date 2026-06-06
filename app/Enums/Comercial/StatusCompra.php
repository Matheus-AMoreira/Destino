<?php

namespace App\Enums\Comercial;

enum StatusCompra: string
{
    case PENDENTE = 'PENDENTE';
    case RECUSADO = 'RECUSADO';
    case ACEITO = 'ACEITO';
}
