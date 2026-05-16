<?php

namespace App\Domain\Hospedagem\DTOs;

/**
 * DTO de saída para hotéis (admin e detalhes de oferta).
 */
readonly class HotelDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public string $nome,
        public string $endereco,
        public int $diaria,
        public ?string $cidadeNome = null,
        public ?string $estadoNome = null,
        public ?string $estadoSigla = null,
        public ?string $regiaoNome = null,
        public ?int $cidadeId = null,
        public ?int $estadoId = null,
        public ?int $regiaoId = null,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'endereco' => $this->endereco,
            'diaria' => $this->diaria,
            'cidade' => $this->cidadeNome ? [
                'id' => $this->cidadeId,
                'nome' => $this->cidadeNome,
                'estado' => [
                    'id' => $this->estadoId,
                    'nome' => $this->estadoNome,
                    'sigla' => $this->estadoSigla,
                    'regiao' => $this->regiaoNome ? [
                        'id' => $this->regiaoId,
                        'nome' => $this->regiaoNome,
                    ] : null,
                ],
            ] : null,
            'cidade_id' => $this->cidadeId,
        ];
    }
}
