<?php

namespace App\Domain\Identidade\Enums;

enum UserRole: string
{
    case USUARIO = 'USUARIO';
    case FUNCIONARIO = 'FUNCIONARIO';
    case ADMINISTRADOR = 'ADMINISTRADOR';
}
