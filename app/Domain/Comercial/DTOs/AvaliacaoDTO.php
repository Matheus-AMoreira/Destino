<?php

namespace App\Domain\Comercial\DTOs;

readonly class AvaliacaoDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public int $nota,
        public ?string $comentario,
        public string $userId,
        public string $nomeUsuario,
        public int $pacoteId,
        public string $createdAt,
    ) {}

    public static function fromRow(object $row, string $nomeUsuario): self
    {
        return new self(
            id: $row->id,
            nota: $row->nota,
            comentario: $row->comentario,
            userId: $row->user_id,
            nomeUsuario: $nomeUsuario,
            pacoteId: $row->pacote_id,
            createdAt: $row->created_at,
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nota' => $this->nota,
            'comentario' => $this->comentario,
            'user_id' => $this->userId,
            'nomeUsuario' => $this->nomeUsuario,
            'pacote_id' => $this->pacoteId,
            'created_at' => $this->createdAt,
        ];
    }
}
