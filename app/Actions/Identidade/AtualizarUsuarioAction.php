<?php

namespace App\Actions\Identidade;

use App\Models\Identidade\Usuario;

class AtualizarUsuarioAction
{
    public function execute(Usuario $usuario, array $dados): Usuario
    {
        $permissions = $dados['permissions'] ?? null;
        unset($dados['permissions']);

        $usuario->update($dados);

        if ($permissions !== null) {
            $usuario->permissions()->sync($permissions);
        }

        return $usuario;
    }
}
