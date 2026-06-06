<?php

namespace App\Actions\Identidade;

use App\Models\Identidade\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CriarUsuarioAction
{
    public function execute(array $dados): array
    {
        $plainPassword = Str::random(10);
        $dados['password'] = Hash::make($plainPassword);
        
        $permissions = $dados['permissions'] ?? [];
        unset($dados['permissions']);

        $usuario = Usuario::create($dados);

        if (!empty($permissions)) {
            $usuario->permissions()->sync($permissions);
        }

        return [$usuario, $plainPassword];
    }
}
