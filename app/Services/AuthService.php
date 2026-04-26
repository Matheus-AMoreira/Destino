<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthService
{
    /**
     * Cache de permissões em memória para a duração da requisição.
     */
    protected array $permissionsCache = [];

    /**
     * Verifica se o usuário tem a permissão solicitada.
     */
    public function isAuthorized(User $user, string $slug): bool
    {
        // 1. Carrega as permissões do usuário se ainda não estiverem no cache
        if (!isset($this->permissionsCache[$user->id])) {
            $this->loadUserPermissions($user);
        }

        // 2. Administrador tem "Master Key" (herda tudo implicitamente)
        // Mas o check ainda ocorre para registrar se houver herança explícita
        if ($this->permissionsCache[$user->id]['role'] === 'ADMINISTRADOR') {
            return true;
        }

        // 3. Verifica se o slug existe nas permissões do papel do usuário
        return in_array($slug, $this->permissionsCache[$user->id]['permissions']);
    }

    /**
     * Retorna a lista de slugs de permissão para o frontend.
     */
    public function loadUserPermissionsForFrontend(User $user): array
    {
        if (!isset($this->permissionsCache[$user->id])) {
            $this->loadUserPermissions($user);
        }

        return collect($this->permissionsCache[$user->id]['permissions'])->map(function($slug) {
            return ['slug' => $slug];
        })->toArray();
    }

    /**
     * Carrega as permissões do banco para o cache.
     */
    protected function loadUserPermissions(User $user): void
    {
        $role = $user->role;
        $rolePermissions = $role ? $role->permissions->pluck('slug')->toArray() : [];
        $directPermissions = $user->permissions->pluck('slug')->toArray();

        // Une as duas fontes de permissão e remove duplicatas
        $allPermissions = array_unique(array_merge($rolePermissions, $directPermissions));

        // Administrador herda tudo (Master Key)
        if ($role && $role->name === 'ADMINISTRADOR') {
            $allPermissions = \App\Models\Permission::pluck('slug')->toArray();
        }

        $this->permissionsCache[$user->id] = [
            'role' => $role ? $role->name : null,
            'permissions' => $allPermissions
        ];
    }
}
