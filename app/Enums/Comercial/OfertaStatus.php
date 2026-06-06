<?php

namespace App\Enums\Comercial;

enum OfertaStatus: string
{
    case CONCLUIDO = 'CONCLUIDO';
    case EMANDAMENTO = 'EMANDAMENTO';
    case CANCELADO = 'CANCELADO';
}
