<?php

namespace App\Domain\Comercial\Enums;

enum OfertaStatus: string
{
    case CONCLUIDO = 'CONCLUIDO';
    case EMANDAMENTO = 'EMANDAMENTO';
    case CANCELADO = 'CANCELADO';
}
