<?php

namespace App\Infrastructure\Persistence\Identidade;

use App\Domain\Identidade\Entities\Usuario;
use App\Domain\Identidade\Entities\Role;
use App\Domain\Identidade\Entities\Permission;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use App\Domain\Shared\PaginatedResult;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class UsuarioRepository implements UsuarioRepositoryInterface
{
    public function buscarPorId(string $id): ?Usuario
    {
        $row = DB::table('users')->where('id', $id)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function buscarPorEmail(string $email): ?Usuario
    {
        $row = DB::table('users')->where('email', $email)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function existePorEmailOuCpf(string $email, string $cpf): bool
    {
        return DB::table('users')
            ->where('email', $email)
            ->orWhere('cpf', $cpf)
            ->exists();
    }

    public function paginar(string $tab, ?string $termo, int $perPage = 20, ?string $excludeId = null): PaginatedResult
    {
        $isStaff = $tab === 'funcionarios';

        $query = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.is_staff', $isStaff)
            ->select('users.*', 'roles.name as role_name', 'roles.is_staff as role_is_staff');

        if ($excludeId) {
            $query->where('users.id', '!=', $excludeId);
        }

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                $q->where('users.nome', 'ilike', "%{$termo}%")
                  ->orWhere('users.email', 'ilike', "%{$termo}%");
            });
        }

        $total = $query->count();
        $page = (int) request()->get('page', 1);
        $items = $query->latest('users.created_at')->forPage($page, $perPage)->get()->all();

        return new PaginatedResult(items: $items, total: $total, page: $page, perPage: $perPage);
    }

    public function atualizar(string $id, array $dados): bool
    {
        $dados['updated_at'] = now();
        return DB::table('users')->where('id', $id)->update($dados) > 0;
    }

    // === Roles ===

    public function listarRoles(bool $apenasStaff = false, bool $excluirAdmin = false): array
    {
        $query = DB::table('roles');
        if ($apenasStaff) $query->where('is_staff', true);
        if ($excluirAdmin) $query->where('name', '!=', 'ADMINISTRADOR');

        return $query->get()->map(fn($r) => new Role(
            id: $r->id, name: $r->name, description: $r->description, isStaff: (bool) $r->is_staff,
        ))->all();
    }

    public function buscarRolePorId(int $id): ?Role
    {
        $row = DB::table('roles')->where('id', $id)->first();
        return $row ? new Role($row->id, $row->name, $row->description, (bool) $row->is_staff) : null;
    }

    public function buscarRolePorNome(string $name): ?Role
    {
        $row = DB::table('roles')->where('name', $name)->first();
        return $row ? new Role($row->id, $row->name, $row->description, (bool) $row->is_staff) : null;
    }

    // === Permissions ===

    public function listarPermissions(bool $apenasStaff = false): array
    {
        $query = DB::table('permissions');
        if ($apenasStaff) $query->where('is_staff', true);

        return $query->get()->map(fn($p) => new Permission(
            id: $p->id, slug: $p->slug, description: $p->description, isStaff: (bool) $p->is_staff,
        ))->all();
    }

    public function buscarPermissoesDoUsuario(string $userId): array
    {
        $roleId = DB::table('users')->where('id', $userId)->value('role_id');

        $rolePerms = $roleId
            ? DB::table('permissions')
                ->join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
                ->where('role_permissions.role_id', $roleId)
                ->pluck('permissions.slug')
                ->all()
            : [];

        $directPerms = DB::table('permissions')
            ->join('user_permissions', 'permissions.id', '=', 'user_permissions.permission_id')
            ->where('user_permissions.user_id', $userId)
            ->pluck('permissions.slug')
            ->all();

        return array_values(array_unique(array_merge($rolePerms, $directPerms)));
    }

    public function buscarPermissoesDaRole(int $roleId): array
    {
        return DB::table('permissions')
            ->join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->where('role_permissions.role_id', $roleId)
            ->pluck('permissions.slug')
            ->all();
    }

    public function sincronizarPermissoesDoUsuario(string $userId, array $permissionIds): void
    {
        DB::table('user_permissions')->where('user_id', $userId)->delete();

        $records = array_map(fn(int $pid) => [
            'user_id' => $userId,
            'permission_id' => $pid,
            'created_at' => now(),
            'updated_at' => now(),
        ], $permissionIds);

        if (!empty($records)) {
            DB::table('user_permissions')->insert($records);
        }
    }

    // === Contadores ===

    public function contarUsuarios(): int
    {
        return DB::table('users')->count();
    }

    public function listarFuncionarios(): array
    {
        return DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.is_staff', true)
            ->select('users.id', 'users.nome', 'users.email')
            ->get()
            ->all();
    }

    // === CPF ===

    public function buscarCpfDescriptografado(string $userId): ?string
    {
        $encrypted = DB::table('users')->where('id', $userId)->value('cpf');
        if (!$encrypted) return null;

        try {
            return Crypt::decryptString($encrypted);
        } catch (\Exception) {
            return $encrypted;
        }
    }

    public function criar(array $dados): string
    {
        $id = $dados['id'] ?? (string) \Illuminate\Support\Str::uuid();
        DB::table('users')->insert([
            'id' => $id,
            'nome' => $dados['nome'],
            'sobre_nome' => $dados['sobre_nome'],
            'cpf' => $dados['cpf'],
            'telefone' => $dados['telefone'],
            'email' => $dados['email'],
            'password' => $dados['password'],
            'role_id' => $dados['role_id'],
            'is_valid' => $dados['is_valid'] ?? true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return $id;
    }

    public function deletar(string $id): bool
    {
        return DB::table('users')->where('id', $id)->delete() > 0;
    }

    public function buscarHashSenha(string $userId): ?string
    {
        return DB::table('users')->where('id', $userId)->value('password');
    }

    public function listarTodasPermissoes(): array
    {
        return DB::table('permissions')->pluck('slug')->all();
    }

    private function hydrate(object $row): Usuario
    {
        return new Usuario(
            id: $row->id,
            nome: $row->nome,
            sobreNome: $row->sobre_nome,
            email: $row->email,
            telefone: $row->telefone,
            isValid: (bool) $row->is_valid,
            roleId: $row->role_id ? (int) $row->role_id : null,
            emailVerifiedAt: $row->email_verified_at,
            createdAt: $row->created_at,
            updatedAt: $row->updated_at,
        );
    }
}
