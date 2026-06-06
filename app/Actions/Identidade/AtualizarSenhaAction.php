<?php

namespace App\Actions\Identidade;

use App\Models\Identidade\Usuario;
use Illuminate\Support\Facades\Hash;

class AtualizarSenhaAction
{
    public function execute(Usuario $user, string $novaSenha): Usuario
    {
        $user->password = Hash::make($novaSenha);
        $user->save();

        return $user;
    }
}
