<?php

namespace App\Services\Identidade;

use App\Models\Identidade\Usuario;
use App\Models\Identidade\Permission;

class AuthService
{
    /** @var array<string, array{role: ?string, permissions: string[]}> */
    protected array $cache = [];

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

    public function buildAuthDTO(string $userId): ?array
    {
        $user = Usuario::with('role')->find($userId);
        if (!$user) return null;

        $role = $user->role;

        return [
            'id' => $user->id,
            'nome' => $user->nome,
            'sobre_nome' => $user->sobre_nome,
            'email' => $user->email,
            'role_name' => $role?->name,
            'role_id' => $role?->id,
            'is_staff' => $role?->is_staff ?? false,
            'role' => $role ? [
                'id' => $role->id,
                'name' => $role->name,
                'is_staff' => (bool) $role->is_staff,
            ] : null,
            'permissions' => $this->loadPermissionsForFrontend($userId),
        ];
    }

    /**
     * @return array{role: ?string, permissions: string[]}
     */
    private function loadPermissions(string $userId): array
    {
        if (isset($this->cache[$userId])) {
            return $this->cache[$userId];
        }

        $user = Usuario::with('role')->find($userId);
        if (!$user) {
            $this->cache[$userId] = ['role' => null, 'permissions' => []];
            return $this->cache[$userId];
        }

        $role = $user->role;
        $roleName = $role?->name;

        if ($roleName === 'ADMINISTRADOR') {
            $allPerms = Permission::all()->pluck('slug')->toArray();
            $this->cache[$userId] = ['role' => $roleName, 'permissions' => $allPerms];
            return $this->cache[$userId];
        }

        $rolePerms = $role
            ? $role->permissions()->pluck('slug')->toArray()
            : [];

        $directPerms = $user->permissions()->pluck('slug')->toArray();

        $perms = array_values(array_unique(array_merge($rolePerms, $directPerms)));
        
        $this->cache[$userId] = ['role' => $roleName, 'permissions' => $perms];

        return $this->cache[$userId];
    }
}
