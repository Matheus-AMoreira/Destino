<?php

namespace App\Enums;

enum UserRole: string
{
    case USUARIO = 'USUARIO';
    case FUNCIONARIO = 'FUNCIONARIO';
    case ADMINISTRADOR = 'ADMINISTRADOR';
}
