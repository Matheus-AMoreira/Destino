<?php

namespace App\Enums\Comercial;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum Metodo: string
{
    case VISTA = 'VISTA';
    case PARCELADO = 'PARCELADO';
}
