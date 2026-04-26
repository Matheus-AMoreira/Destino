<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class AuthorizationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar Permissões
        $permissions = [
            // Dashboard
            ['slug' => 'dashboard:read', 'description' => 'Acessar painel administrativo', 'is_staff' => true],

            // Usuários
            ['slug' => 'user:read', 'description' => 'Visualizar usuários', 'is_staff' => true],
            ['slug' => 'user:create', 'description' => 'Cadastrar novos funcionários', 'is_staff' => true],
            ['slug' => 'user:update', 'description' => 'Editar usuários', 'is_staff' => true],
            ['slug' => 'user:delete', 'description' => 'Deletar usuários', 'is_staff' => true],

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

        foreach ($permissions as $p) {
            Permission::updateOrCreate(['slug' => $p['slug']], $p);
        }

        // 2. Criar Cargos
        $adminRole = Role::updateOrCreate(['name' => 'ADMINISTRADOR'], [
            'description' => 'Acesso total ao sistema e banco de dados',
            'is_staff' => true
        ]);

        $funcionarioRole = Role::updateOrCreate(['name' => 'FUNCIONARIO'], [
            'description' => 'Auxiliar administrativo com acesso a hotéis e pacotes',
            'is_staff' => true
        ]);

        $usuarioRole = Role::updateOrCreate(['name' => 'USUARIO'], [
            'description' => 'Cliente final da plataforma',
            'is_staff' => false
        ]);

        // 3. Vincular Permissões aos Cargos Staff
        $adminPermissions = Permission::all();
        $adminRole->permissions()->sync($adminPermissions);

        $funcionarioPermissions = Permission::whereIn('slug', [
            'dashboard:read',
            'user:read',
            'hotel:read', 'hotel:create', 'hotel:update',
            'package:read', 'package:create', 'package:update',
            'package-photo:read', 'package-photo:create', 'package-photo:update',
            'offer:read', 'offer:create', 'offer:update',
            'transport:read', 'transport:create', 'transport:update'
        ])->get();
        $funcionarioRole->permissions()->sync($funcionarioPermissions);
        
        // Usuário comum pode ter apenas permissões não-staff
        $usuarioPermissions = Permission::where('is_staff', false)->get();
        $usuarioRole->permissions()->sync($usuarioPermissions);
    }
}
