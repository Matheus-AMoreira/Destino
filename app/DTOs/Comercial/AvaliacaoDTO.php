<?php

namespace App\DTOs\Comercial;

use JsonSerializable;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class AvaliacaoDTO implements JsonSerializable
{
    public function __construct(
        public int $id,
        public int $nota,
        public ?string $comentario,
        public string $user_id,
        public string $nomeUsuario,
        public int $pacote_id,
        public ?string $created_at
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nota' => $this->nota,
            'comentario' => $this->comentario,
            'user_id' => $this->user_id,
            'nomeUsuario' => $this->nomeUsuario,
            'pacote_id' => $this->pacote_id,
            'created_at' => $this->created_at,
        ];
    }
}
