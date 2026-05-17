<?php

namespace App\Domain\Identidade\DTOs;

/**
 * DTO de saída para edição de perfil (inclui CPF real para o próprio usuário).
 */
readonly class UsuarioPerfilDTO implements \JsonSerializable
{
    public function __construct(
        public string $id,
        public string $nome,
        public string $sobreNome,
        public string $email,
        public string $telefone,
        public string $cpf,
        public string $cpfMascarado,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'sobre_nome' => $this->sobreNome,
            'email' => $this->email,
            'telefone' => $this->telefone,
            'cpf' => $this->cpf,
            'cpf_mascarado' => $this->cpfMascarado,
        ];
    }
}
