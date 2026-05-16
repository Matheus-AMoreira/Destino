<?php

namespace App\Domain\Identidade\DTOs;

/**
 * DTO de saída para dados seguros do usuário (sem CPF, sem password).
 */
readonly class UsuarioDTO implements \JsonSerializable
{
    public function __construct(
        public string $id,
        public string $nome,
        public string $sobreNome,
        public string $email,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'sobre_nome' => $this->sobreNome,
            'email' => $this->email,
        ];
    }
}
