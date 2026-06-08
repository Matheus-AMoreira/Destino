<?php

namespace App\Enums\Comercial;

enum StatusCompra: string
{
    case PENDENTE = 'pending';
    case RECUSADO = 'rejected';
    case ACEITO = 'approved';

    public function label(): string
    {
        return match ($this) {
            self::PENDENTE => 'Pendente',
            self::RECUSADO => 'Recusado',
            self::ACEITO => 'Aceito',
        };
    }
}
