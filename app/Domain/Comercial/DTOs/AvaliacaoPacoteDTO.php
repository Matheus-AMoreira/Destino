<?php

namespace App\Domain\Comercial\DTOs;

readonly class AvaliacaoPacoteDTO implements \JsonSerializable
{
    /**
     * @param AvaliacaoDTO[] $avaliacoes
     */
    public function __construct(
        public float $notaMedia,
        public int $quantidadeAvaliacoes,
        public array $avaliacoes,
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
