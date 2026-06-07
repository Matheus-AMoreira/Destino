<?php

namespace App\DTOs\Shared;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class EstatisticasDTO implements \JsonSerializable
{
    public function __construct(
        public int $usuarios,
        public int $hoteis,
        public int $transportes,
        public int $pacotes,
        public int $ofertas,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'usuarios' => $this->usuarios,
            'hoteis' => $this->hoteis,
            'transportes' => $this->transportes,
            'pacotes' => $this->pacotes,
            'ofertas' => $this->ofertas,
        ];
    }
}
