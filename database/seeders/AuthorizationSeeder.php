<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthorizationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar Permissões (usando Query Builder)
        $permissions = [
            // Dashboard
            ['slug' => 'dashboard:read', 'description' => 'Acessar painel administrativo', 'is_staff' => true],

            // Usuários — Clientes
            ['slug' => 'user-client:read', 'description' => 'Visualizar clientes', 'is_staff' => true],
            ['slug' => 'user-client:update', 'description' => 'Editar perfil de clientes', 'is_staff' => true],
            ['slug' => 'user-client:delete', 'description' => 'Deletar clientes', 'is_staff' => true],
            ['slug' => 'user-client:status', 'description' => 'Alterar status de clientes (bloquear/liberar)', 'is_staff' => true],

            // Usuários — Funcionários (somente Admin)
            ['slug' => 'user-staff:read', 'description' => 'Visualizar funcionários', 'is_staff' => true],
            ['slug' => 'user-staff:create', 'description' => 'Cadastrar novos funcionários', 'is_staff' => true],
            ['slug' => 'user-staff:update', 'description' => 'Editar perfil de funcionários', 'is_staff' => true],
            ['slug' => 'user-staff:status', 'description' => 'Alterar status de funcionários (bloquear/liberar)', 'is_staff' => true],

            // Usuários — Controle de Acesso (somente Admin)
            ['slug' => 'user:manage-role', 'description' => 'Alterar cargo de usuários (promover/rebaixar)', 'is_staff' => true],
            ['slug' => 'user:manage-permissions', 'description' => 'Alterar permissões diretas de usuários', 'is_staff' => true],

            // Hotéis
            ['slug' => 'hotel:read', 'description' => 'Visualizar hotéis', 'is_staff' => true],
            ['slug' => 'hotel:create', 'description' => 'Criar hotéis', 'is_staff' => true],
            ['slug' => 'hotel:update', 'description' => 'Editar hotéis', 'is_staff' => true],
            ['slug' => 'hotel:delete', 'description' => 'Deletar hotéis', 'is_staff' => true],

            // Pacotes
            ['slug' => 'package:read', 'description' => 'Visualizar pacotes', 'is_staff' => true],
            ['slug' => 'package:create', 'description' => 'Criar pacotes', 'is_staff' => true],
            ['slug' => 'package:update', 'description' => 'Editar pacotes', 'is_staff' => true],
            ['slug' => 'package:delete', 'description' => 'Deletar pacotes', 'is_staff' => true],

            // Pacotes de Fotos
            ['slug' => 'package-photo:read', 'description' => 'Visualizar pacotes de fotos', 'is_staff' => true],
            ['slug' => 'package-photo:create', 'description' => 'Criar pacotes de fotos', 'is_staff' => true],
            ['slug' => 'package-photo:update', 'description' => 'Editar pacotes de fotos', 'is_staff' => true],
            ['slug' => 'package-photo:delete', 'description' => 'Deletar pacotes de fotos', 'is_staff' => true],

            // Ofertas
            ['slug' => 'offer:read', 'description' => 'Visualizar ofertas', 'is_staff' => true],
            ['slug' => 'offer:create', 'description' => 'Criar ofertas', 'is_staff' => true],
            ['slug' => 'offer:update', 'description' => 'Editar ofertas', 'is_staff' => true],
            ['slug' => 'offer:delete', 'description' => 'Deletar ofertas', 'is_staff' => true],

            // Transportes
            ['slug' => 'transport:read', 'description' => 'Visualizar transportes', 'is_staff' => true],
            ['slug' => 'transport:create', 'description' => 'Criar transportes', 'is_staff' => true],
            ['slug' => 'transport:update', 'description' => 'Editar transportes', 'is_staff' => true],
            ['slug' => 'transport:delete', 'description' => 'Deletar transportes', 'is_staff' => true],

            // Perfil/Geral (Ações do Cliente)
            ['slug' => 'profile:update', 'description' => 'Atualizar próprio perfil', 'is_staff' => false],
            ['slug' => 'profile:delete', 'description' => 'Solicitar exclusão da própria conta', 'is_staff' => false],
            ['slug' => 'purchase:create', 'description' => 'Realizar compras', 'is_staff' => false],
            ['slug' => 'purchase:read', 'description' => 'Visualizar próprias compras', 'is_staff' => false],
        ];

        // Remover permissões antigas que foram substituídas
        $oldSlugs = ['user:read', 'user:create', 'user:update', 'user:delete'];
        DB::table('permissions')->whereIn('slug', $oldSlugs)->delete();

        foreach ($permissions as $p) {
            $exists = DB::table('permissions')->where('slug', $p['slug'])->first();
            if (!$exists) {
                DB::table('permissions')->insert([
                    'slug' => $p['slug'],
                    'description' => $p['description'],
                    'is_staff' => $p['is_staff'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                DB::table('permissions')->where('id', $exists->id)->update([
                    'description' => $p['description'],
                    'is_staff' => $p['is_staff'],
                    'updated_at' => now(),
                ]);
            }
        }

        // 2. Criar Cargos
        $roles = [
            ['name' => 'ADMINISTRADOR', 'description' => 'Acesso total ao sistema e banco de dados', 'is_staff' => true],
            ['name' => 'FUNCIONARIO', 'description' => 'Auxiliar administrativo com acesso a hotéis e pacotes', 'is_staff' => true],
            ['name' => 'USUARIO', 'description' => 'Cliente final da plataforma', 'is_staff' => false],
        ];

        foreach ($roles as $r) {
            $exists = DB::table('roles')->where('name', $r['name'])->first();
            if (!$exists) {
                DB::table('roles')->insert([
                    'name' => $r['name'],
                    'description' => $r['description'],
                    'is_staff' => $r['is_staff'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                DB::table('roles')->where('id', $exists->id)->update([
                    'description' => $r['description'],
                    'is_staff' => $r['is_staff'],
                    'updated_at' => now(),
                ]);
            }
        }

        // 3. Vincular Permissões aos Cargos Staff
        $adminRole = DB::table('roles')->where('name', 'ADMINISTRADOR')->first();
        $funcionarioRole = DB::table('roles')->where('name', 'FUNCIONARIO')->first();
        $usuarioRole = DB::table('roles')->where('name', 'USUARIO')->first();

        // Admin: todas as permissões
        $allPermissionIds = DB::table('permissions')->pluck('id')->all();
        $this->syncRolePermissions($adminRole->id, $allPermissionIds);

        // Funcionário: permissões específicas (sem gerenciamento de staff, cargos ou permissões)
        $funcSlugs = [
            'dashboard:read',
            // Clientes — visualizar, editar, deletar, alterar status
            'user-client:read', 'user-client:update', 'user-client:delete', 'user-client:status',
            // Hotéis, pacotes, fotos, ofertas, transportes — CRUD sem delete
            'hotel:read', 'hotel:create', 'hotel:update',
            'package:read', 'package:create', 'package:update',
            'package-photo:read', 'package-photo:create', 'package-photo:update',
            'offer:read', 'offer:create', 'offer:update',
            'transport:read', 'transport:create', 'transport:update'
        ];
        $funcPermissionIds = DB::table('permissions')->whereIn('slug', $funcSlugs)->pluck('id')->all();
        $this->syncRolePermissions($funcionarioRole->id, $funcPermissionIds);
        
        // Usuário: permissões não-staff
        $userPermissionIds = DB::table('permissions')->where('is_staff', false)->pluck('id')->all();
        $this->syncRolePermissions($usuarioRole->id, $userPermissionIds);
    }

    private function syncRolePermissions(int $roleId, array $permissionIds): void
    {
        DB::table('role_permissions')->where('role_id', $roleId)->delete();
        $records = array_map(fn($pid) => [
            'role_id' => $roleId,
            'permission_id' => $pid,
            'created_at' => now(),
            'updated_at' => now(),
        ], $permissionIds);
        
        if (!empty($records)) {
            DB::table('role_permissions')->insert($records);
        }
    }
}
