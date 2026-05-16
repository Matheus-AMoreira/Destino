<?php

namespace App\Application\Identidade;

use App\Domain\Identidade\DTOs\AuthDTO;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use Illuminate\Support\Facades\DB;

/**
 * Serviço de autorização (permissões).
 * Cache em memória por request. Usa Query Builder.
 */
class AuthService
{
    /** @var array<string, array{role: ?string, permissions: string[]}> */
    protected array $cache = [];

    public function __construct(
        private readonly UsuarioRepositoryInterface $usuarioRepo,
    ) {}

    public function isAuthorized(string $userId, string $permissionSlug): bool
    {
        $data = $this->loadPermissions($userId);

        if ($data['role'] === 'ADMINISTRADOR') {
            return true;
        }

        return in_array($permissionSlug, $data['permissions']);
    }

    /**
     * @return array<array{slug: string}>
     */
    public function loadPermissionsForFrontend(string $userId): array
    {
        $data = $this->loadPermissions($userId);

        return array_map(
            fn(string $slug) => ['slug' => $slug],
            $data['permissions']
        );
    }

    public function buildAuthDTO(string $userId): ?AuthDTO
    {
        $user = $this->usuarioRepo->buscarPorId($userId);
        if (!$user) return null;

        $data = $this->loadPermissions($userId);
        $role = $user->roleId ? $this->usuarioRepo->buscarRolePorId($user->roleId) : null;

        return new AuthDTO(
            id: $user->id,
            nome: $user->nome,
            sobreNome: $user->sobreNome,
            email: $user->email,
            roleName: $role?->name,
            roleId: $role?->id,
            isStaff: $role?->isStaff ?? false,
            permissions: $this->loadPermissionsForFrontend($userId),
        );
    }

    /**
     * @return array{role: ?string, permissions: string[]}
     */
    private function loadPermissions(string $userId): array
    {
        if (isset($this->cache[$userId])) {
            return $this->cache[$userId];
        }

        $user = $this->usuarioRepo->buscarPorId($userId);
        if (!$user) {
            $this->cache[$userId] = ['role' => null, 'permissions' => []];
            return $this->cache[$userId];
        }

        $role = $user->roleId ? $this->usuarioRepo->buscarRolePorId($user->roleId) : null;
        $roleName = $role?->name;

        if ($roleName === 'ADMINISTRADOR') {
            $allPerms = DB::table('permissions')->pluck('slug')->all();
            $this->cache[$userId] = ['role' => $roleName, 'permissions' => $allPerms];
            return $this->cache[$userId];
        }

        $perms = $this->usuarioRepo->buscarPermissoesDoUsuario($userId);
        $this->cache[$userId] = ['role' => $roleName, 'permissions' => $perms];

        return $this->cache[$userId];
    }
}
