<?php

namespace App\Domain\Shared\DTOs;

readonly class AtividadeRecenteDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public string $description,
        public string $time,
        public string $causer,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'time' => $this->time,
            'causer' => $this->causer,
        ];
    }
}
