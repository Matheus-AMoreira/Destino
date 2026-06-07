<?php

namespace App\DTOs\Shared;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class DadosGraficosDTO implements \JsonSerializable
{
    public function __construct(
        public array $compras,
        public array $destinosPopulares,
        public array $crescimentoUsuarios,
        public array $anosDisponiveis,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'compras' => $this->compras,
            'destinosPopulares' => $this->destinosPopulares,
            'crescimentoUsuarios' => $this->crescimentoUsuarios,
            'anosDisponiveis' => $this->anosDisponiveis,
        ];
    }
}
