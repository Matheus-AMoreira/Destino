<?php

namespace App\Enums;

enum OfertaStatus: string
{
    case CONCLUIDO = 'CONCLUIDO';
    case EMANDAMENTO = 'EMANDAMENTO';
    case CANCELADO = 'CANCELADO';
}
