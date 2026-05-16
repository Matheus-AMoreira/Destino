<?php

namespace App\Domain\Comercial\DTOs;

use App\Enums\OfertaStatus;

/**
 * DTO de saída para ofertas (usado em detalhes de pacote e admin).
 */
readonly class OfertaDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public float $preco,
        public string $inicio,
        public string $fim,
        public int $disponibilidade,
        public OfertaStatus $status,
        public bool $isAvailable,
        public ?array $hotel,
        public ?array $transporte,
        public ?array $pacote = null,
    ) {}

    public function jsonSerialize(): array
    {
        $data = [
            'id' => $this->id,
            'preco' => $this->preco,
            'inicio' => $this->inicio,
            'fim' => $this->fim,
            'disponibilidade' => $this->disponibilidade,
            'status' => $this->status->value,
            'is_available' => $this->isAvailable,
            'hotel' => $this->hotel,
            'transporte' => $this->transporte,
        ];

        if ($this->pacote !== null) {
            $data['pacote'] = $this->pacote;
        }

        return $data;
    }
}
