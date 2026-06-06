<?php

namespace App\Enums\Identidade;

enum UserRole: string
{
    case USUARIO = 'USUARIO';
    case FUNCIONARIO = 'FUNCIONARIO';
    case ADMINISTRADOR = 'ADMINISTRADOR';
}
