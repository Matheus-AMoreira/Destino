<?php

namespace App\Repositories\Identidade;

use App\Models\Identidade\Usuario;
use App\Models\Identidade\Role;

class UsuarioRepository
{
    public function obterTodosParaAdmin(): array
    {
        return Usuario::with('role')->get()->map(function(Usuario $u) {
            return [
                'id' => $u->id,
                'nome' => $u->nome,
                'sobre_nome' => $u->sobre_nome,
                'email' => $u->email,
                'cpf' => $u->cpf ? $u->cpf->masked() : null, // Masked CPF for safety
                'telefone' => $u->telefone,
                'status' => $u->status,
                'role' => $u->role ? [
                    'id' => $u->role->id,
                    'nome' => $u->role->nome,
                    'is_staff' => $u->role->is_staff,
                ] : null,
            ];
        })->toArray();
    }

    public function obterFuncionarios(): array
    {
        return Usuario::query()
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.is_staff', true)
            ->select('users.id', 'users.nome', 'users.email')
            ->get()
            ->toArray();
    }

    public function buscarPorId(string $id): ?Usuario
    {
        return Usuario::find($id);
    }

    public function buscarPorEmail(string $email): ?Usuario
    {
        return Usuario::where('email', $email)->first();
    }

    public function obterRoles(): array
    {
        return Role::all()->toArray();
    }
}
