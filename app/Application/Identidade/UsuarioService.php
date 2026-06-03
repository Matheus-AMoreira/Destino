<?php

namespace App\Application\Identidade;

use App\Application\Shared\ActivityLogService;
use App\Domain\Identidade\DTOs\UsuarioAdminDTO;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use App\Domain\Shared\PaginatedResult;
use Illuminate\Support\Str;

class UsuarioService
{
    public function __construct(
        private readonly UsuarioRepositoryInterface $repo,
        private readonly ActivityLogService $log,
    ) {}

    public function listarCards(string $tab, ?string $termo, string $currentUserId, int $page): PaginatedResult
    {
        $result = $this->repo->paginar($tab, $termo, 20, $currentUserId);

        $dtos = array_map(function ($u) use ($tab) {
            $isStaff = $tab === 'funcionarios';
            $perms = $this->repo->buscarPermissoesDoUsuario($u->id);
            $permsFormatted = array_map(fn($p) => ['slug' => $p], $perms);

            return UsuarioAdminDTO::fromRow($u, $u->role_name ?? '', $isStaff, $permsFormatted);
        }, $result->items);

        return new PaginatedResult($dtos, $result->total, $result->page, $result->perPage);
    }

    public function buscarPorId(string $id): ?\App\Domain\Identidade\Entities\Usuario
    {
        return $this->repo->buscarPorId($id);
    }

    public function criarFuncionario(array $dados, array $permissoesIds): string
    {
        if ($this->repo->existePorEmailOuCpf($dados['email'], $dados['cpf'])) {
            throw new \InvalidArgumentException('Usuário com este email ou cpf já existe.');
        }

        $dados['id'] = (string) Str::uuid();
        $dados['is_valid'] = true;
        
        // Criptografar CPF (isso deveria estar no repository, mas por segurança fazemos aqui ou num trait)
        if (isset($dados['cpf'])) {
            $dados['cpf'] = \Illuminate\Support\Facades\Crypt::encryptString(preg_replace('/\D/', '', $dados['cpf']));
        }
        
        // Hash password
        $dados['password'] = \Illuminate\Support\Facades\Hash::make($dados['password']);
        $dados['email_verified_at'] = now();

        $this->repo->criar($dados);

        $this->repo->sincronizarPermissoesDoUsuario($dados['id'], $permissoesIds);

        $this->log->logCreated('User', $dados['id'], ['email' => $dados['email'], 'role_id' => $dados['role_id']]);

        return $dados['id'];
    }

    public function atualizarFuncionario(string $id, array $dados, array $permissoesIds): bool
    {
        if (isset($dados['cpf'])) {
            $dados['cpf'] = \Illuminate\Support\Facades\Crypt::encryptString(preg_replace('/\D/', '', $dados['cpf']));
        }
        
        if (isset($dados['password'])) {
            $dados['password'] = \Illuminate\Support\Facades\Hash::make($dados['password']);
        }

        $result = $this->repo->atualizar($id, $dados);
        $this->repo->sincronizarPermissoesDoUsuario($id, $permissoesIds);

        $this->log->logUpdated('User', $id, [], $dados);

        return $result;
    }

    public function deletar(string $id): bool
    {
        $this->log->logDeleted('User', $id);
        return $this->repo->deletar($id);
    }

    public function bloquearOuDesbloquear(string $id, bool $isValid): bool
    {
        $this->log->log('status_changed', 'User', $id, ['is_valid' => $isValid]);
        return $this->repo->atualizar($id, ['is_valid' => $isValid]);
    }

    public function listarRoles(bool $apenasStaff = false, bool $excluirAdmin = false): array
    {
        return $this->repo->listarRoles($apenasStaff, $excluirAdmin);
    }

    public function listarPermissions(bool $apenasStaff = false): array
    {
        return $this->repo->listarPermissions($apenasStaff);
    }

    public function listarFuncionarios(): array
    {
        return $this->repo->listarFuncionarios();
    }

    public function buscarIdsPermissoesDiretasDoUsuario(string $userId): array
    {
        return $this->repo->buscarIdsPermissoesDiretasDoUsuario($userId);
    }

    public function buscarRolePorId(int $id): ?\App\Domain\Identidade\Entities\Role
    {
        return $this->repo->buscarRolePorId($id);
    }

    public function buscarCpfDescriptografado(string $userId): ?string
    {
        return $this->repo->buscarCpfDescriptografado($userId);
    }

    public static function encryptId(string $id): string
    {
        $encrypted = \Illuminate\Support\Facades\Crypt::encryptString($id);
        return str_replace(['+', '/', '='], ['-', '_', ''], $encrypted);
    }

    public static function decryptId(string $encrypted): string
    {
        try {
            $base64 = str_replace(['-', '_'], ['+', '/'], $encrypted);
            $padding = strlen($base64) % 4;
            if ($padding > 0) {
                $base64 .= str_repeat('=', 4 - $padding);
            }
            return \Illuminate\Support\Facades\Crypt::decryptString($base64);
        } catch (\Exception) {
            $decoded = base64_decode($encrypted, true);
            return ($decoded !== false) ? $decoded : $encrypted;
        }
    }
}
