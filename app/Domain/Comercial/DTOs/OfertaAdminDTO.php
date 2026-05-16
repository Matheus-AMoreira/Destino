<?php

namespace App\Domain\Comercial\DTOs;

readonly class OfertaAdminDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public float $preco,
        public string $inicio,
        public string $fim,
        public int $disponibilidade,
        public string $status,
        public bool $isAvailable,
        public array $pacote,
        public array $hotel,
        public array $transporte,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'preco' => $this->preco,
            'inicio' => $this->inicio,
            'fim' => $this->fim,
            'disponibilidade' => $this->disponibilidade,
            'status' => $this->status,
            'is_available' => $this->isAvailable,
            'pacote' => $this->pacote,
            'hotel' => $this->hotel,
            'transporte' => $this->transporte,
        ];
    }
}
