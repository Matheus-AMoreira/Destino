<?php

namespace App\Domain\Geografia\DTOs;

/**
 * DTO de saída para localização (cidade + estado + região agrupados).
 */
readonly class LocalizacaoDTO implements \JsonSerializable
{
    public function __construct(
        public int $cidadeId,
        public string $cidadeNome,
        public int $estadoId,
        public string $estadoNome,
        public string $estadoSigla,
        public ?int $regiaoId = null,
        public ?string $regiaoNome = null,
        public ?string $regiaoSigla = null,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->cidadeId,
            'nome' => $this->cidadeNome,
            'estado_id' => $this->estadoId,
            'estado' => [
                'id' => $this->estadoId,
                'nome' => $this->estadoNome,
                'sigla' => $this->estadoSigla,
                'regiao' => $this->regiaoId ? [
                    'id' => $this->regiaoId,
                    'nome' => $this->regiaoNome,
                    'sigla' => $this->regiaoSigla,
                ] : null,
            ],
        ];
    }
}
