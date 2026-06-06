<?php

namespace App\Actions\Identidade;

use App\Models\Identidade\Usuario;

class AtualizarPerfilAction
{
    public function execute(Usuario $user, array $dados): Usuario
    {
        $user->nome = $dados['nome'];
        $user->sobre_nome = $dados['sobre_nome'];
        $user->email = $dados['email'];
        $user->telefone = preg_replace('/\D/', '', $dados['telefone']);
        $user->save();

        return $user;
    }
}
