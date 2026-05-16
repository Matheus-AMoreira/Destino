<?php

namespace App\Domain\Identidade\Repositories;

use App\Domain\Identidade\Entities\Usuario;
use App\Domain\Identidade\Entities\Role;
use App\Domain\Identidade\Entities\Permission;
use App\Domain\Shared\PaginatedResult;

interface UsuarioRepositoryInterface
{
    public function buscarPorId(string $id): ?Usuario;
    public function buscarPorEmail(string $email): ?Usuario;
    public function existePorEmailOuCpf(string $email, string $cpf): bool;

    public function paginar(string $tab, ?string $termo, int $perPage = 20, ?string $excludeId = null): PaginatedResult;
    public function atualizar(string $id, array $dados): bool;

    // === Roles ===
    /** @return Role[] */
    public function listarRoles(bool $apenasStaff = false, bool $excluirAdmin = false): array;
    public function buscarRolePorId(int $id): ?Role;
    public function buscarRolePorNome(string $name): ?Role;

    // === Permissions ===
    /** @return Permission[] */
    public function listarPermissions(bool $apenasStaff = false): array;
    /** @return string[] slugs */
    public function buscarPermissoesDoUsuario(string $userId): array;
    /** @return string[] slugs */
    public function buscarPermissoesDaRole(int $roleId): array;
    public function sincronizarPermissoesDoUsuario(string $userId, array $permissionIds): void;

    // === Contadores ===
    public function contarUsuarios(): int;

    /** @return array */
    public function listarFuncionarios(): array;

    // === CPF (descriptografar para perfil) ===
    public function buscarCpfDescriptografado(string $userId): ?string;
}
