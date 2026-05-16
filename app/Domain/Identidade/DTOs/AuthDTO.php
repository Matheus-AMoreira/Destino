<?php

namespace App\Domain\Identidade\DTOs;

/**
 * DTO de saída para o auth.user compartilhado via Inertia (HandleInertiaRequests).
 */
readonly class AuthDTO implements \JsonSerializable
{
    /**
     * @param array<array{slug: string}> $permissions
     */
    public function __construct(
        public string $id,
        public string $nome,
        public string $sobreNome,
        public string $email,
        public ?string $roleName,
        public ?int $roleId,
        public bool $isStaff,
        public array $permissions,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'sobre_nome' => $this->sobreNome,
            'email' => $this->email,
            'cpf_mascarado' => '',
            'role' => $this->roleName ? ['id' => $this->roleId, 'name' => $this->roleName, 'is_staff' => $this->isStaff] : null,
            'role_id' => $this->roleId,
            'permissions' => $this->permissions,
        ];
    }
}
