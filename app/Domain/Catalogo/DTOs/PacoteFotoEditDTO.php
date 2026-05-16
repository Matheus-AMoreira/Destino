<?php

namespace App\Domain\Catalogo\DTOs;

readonly class PacoteFotoEditDTO implements \JsonSerializable
{
    /**
     * @param PacoteFotoAlbumDTO[] $itens
     */
    public function __construct(
        public int $id,
        public string $nome,
        public string $fotoCapa,
        public bool $isUrl,
        public array $itens,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'foto_capa' => $this->fotoCapa,
            'is_url' => $this->isUrl,
            'itens' => $this->itens,
        ];
    }
}
