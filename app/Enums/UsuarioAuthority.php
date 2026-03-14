<?php

namespace App\Enums;

enum UsuarioAuthority: string
{
    case DELETAR_USUARIO = 'DELETAR_USUARIO';
    case CRIAR_PACOTE = 'CRIAR_PACOTE';
    case EDICAO_PERFIL = 'EDICAO_PERFIL';
}
