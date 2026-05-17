<?php

namespace App\Application\Identidade;

use App\Domain\Identidade\DTOs\UsuarioPerfilDTO;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PerfilService
{
    public function __construct(
        private readonly UsuarioRepositoryInterface $repo,
    ) {}

    public function buscarPerfil(string $userId): ?UsuarioPerfilDTO
    {
        $user = $this->repo->buscarPorId($userId);
        if (!$user) return null;

        $cpfRaw = clone $user; // CPF is not in entity anymore directly
        $cpf = $this->repo->buscarCpfDescriptografado($userId) ?? '';
        
        $cpfMascarado = '';
        if (strlen($cpf) >= 11) {
            $cpfMascarado = substr($cpf, 0, 3) . '.***.***-' . substr($cpf, -2);
        }

        return new UsuarioPerfilDTO(
            id: $user->id,
            nome: $user->nome,
            sobreNome: $user->sobreNome,
            email: $user->email,
            telefone: $user->telefone,
            cpf: $cpf,
            cpfMascarado: $cpfMascarado,
        );
    }

    public function atualizarPerfil(string $userId, array $dados): bool
    {
        if (isset($dados['cpf'])) {
            $dados['cpf'] = Crypt::encryptString(preg_replace('/\D/', '', $dados['cpf']));
        }
        
        if (isset($dados['telefone'])) {
            $dados['telefone'] = preg_replace('/\D/', '', $dados['telefone']);
        }

        return $this->repo->atualizar($userId, $dados);
    }

    public function atualizarSenha(string $userId, string $senhaAtual, string $novaSenha): bool
    {
        $hashAtual = \Illuminate\Support\Facades\DB::table('users')->where('id', $userId)->value('password');
        
        if (!Hash::check($senhaAtual, $hashAtual)) {
            throw ValidationException::withMessages([
                'current_password' => ['A senha atual está incorreta.'],
            ]);
        }

        return $this->repo->atualizar($userId, [
            'password' => Hash::make($novaSenha)
        ]);
    }
}
