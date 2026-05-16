<?php

namespace App\Domain\Identidade\Entities;

readonly class Usuario
{
    public function __construct(
        public string $id,
        public string $nome,
        public string $sobreNome,
        public string $email,
        public string $telefone,
        public bool $isValid,
        public ?int $roleId = null,
        public ?string $emailVerifiedAt = null,
        public ?string $cpf = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
