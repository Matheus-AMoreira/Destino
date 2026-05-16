<?php

namespace App\Domain\Hospedagem\DTOs;

use App\Enums\Meio;

/**
 * DTO de saída para transportes.
 */
readonly class TransporteDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public string $empresa,
        public Meio $meio,
        public int $preco,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'empresa' => $this->empresa,
            'meio' => $this->meio->value,
            'preco' => $this->preco,
        ];
    }
}
