<?php

namespace App\Domain\Catalogo\DTOs;

readonly class PacoteFotoAlbumDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public string $caminhoUrl,
        public bool $isUrl,
        public int $ordem,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'caminho_url' => $this->caminhoUrl,
            'is_url' => $this->isUrl,
            'ordem' => $this->ordem,
        ];
    }
}
