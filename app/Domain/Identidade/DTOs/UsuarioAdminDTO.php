<?php

namespace App\Domain\Identidade\DTOs;

/**
 * DTO de saída para admin visualizar usuários (CPF mascarado).
 */
readonly class UsuarioAdminDTO implements \JsonSerializable
{
    public function __construct(
        public string $id,
        public string $nome,
        public string $sobreNome,
        public string $email,
        public string $telefone,
        public bool $isValid,
        public ?string $emailVerifiedAt,
        public string $cpfMascarado,
        public ?string $roleName,
        public ?int $roleId,
        public bool $isStaff,
        /** @var array<array{slug: string}> */
        public array $permissions,
        public ?string $createdAt,
    ) {}

    public static function fromRow(object $row, string $roleName, bool $isStaff, array $permissions): self
    {
        $cpf = $row->cpf ?? '';
        $cpfMascarado = (strlen($cpf) >= 11)
            ? substr($cpf, 0, 3) . '.***.***-' . substr($cpf, -2)
            : $cpf;

        return new self(
            id: $row->id,
            nome: $row->nome,
            sobreNome: $row->sobre_nome,
            email: $row->email,
            telefone: $row->telefone,
            isValid: (bool) $row->is_valid,
            emailVerifiedAt: $row->email_verified_at,
            cpfMascarado: $cpfMascarado,
            roleName: $roleName,
            roleId: $row->role_id ? (int) $row->role_id : null,
            isStaff: $isStaff,
            permissions: $permissions,
            createdAt: $row->created_at,
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => \App\Application\Identidade\UsuarioService::encryptId($this->id),
            'nome' => $this->nome,
            'sobre_nome' => $this->sobreNome,
            'email' => $this->email,
            'telefone' => $this->telefone,
            'is_valid' => $this->isValid,
            'email_verified_at' => $this->emailVerifiedAt,
            'cpf_mascarado' => $this->cpfMascarado,
            'role' => $this->roleName ? ['id' => $this->roleId, 'name' => $this->roleName, 'is_staff' => $this->isStaff] : null,
            'role_id' => $this->roleId,
            'permissions' => $this->permissions,
            'created_at' => $this->createdAt,
        ];
    }
}
