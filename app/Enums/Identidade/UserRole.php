<?php

namespace App\Enums\Identidade;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum UserRole: string
{
    case USUARIO = 'USUARIO';
    case FUNCIONARIO = 'FUNCIONARIO';
    case ADMINISTRADOR = 'ADMINISTRADOR';
}
