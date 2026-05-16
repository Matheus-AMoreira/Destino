<?php

namespace App\Domain\Catalogo\DTOs;

readonly class PacoteFotoAdminDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public string $nome,
        public string $fotoCapa,
        public string $storageType,
        public int $itemsCount,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'foto_capa' => $this->fotoCapa,
            'storage_type' => $this->storageType,
            'items_count' => $this->itemsCount,
        ];
    }
}
