<?php

namespace App\DTOs\Comercial;

use JsonSerializable;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class AvaliacaoPacoteDTO implements JsonSerializable
{
    /**
     * @param \App\DTOs\Comercial\AvaliacaoDTO[] $avaliacoes
     */
    public function __construct(
        public float $notaMedia,
        public int $quantidadeAvaliacoes,
        public array $avaliacoes
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'notaMedia' => $this->notaMedia,
            'quantidadeAvaliacoes' => $this->quantidadeAvaliacoes,
            'avaliacoes' => $this->avaliacoes,
        ];
    }
}
