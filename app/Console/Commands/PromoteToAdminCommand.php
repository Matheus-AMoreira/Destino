<?php

namespace App\Console\Commands;

use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PromoteToAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:promote {email} {--role=ADMINISTRADOR}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promove um usuário existente a staff (ADMINISTRADOR ou FUNCIONARIO) com todas as permissões correspondentes.';

    /**
     * Execute the console command.
     */
    public function handle(UsuarioRepositoryInterface $repo)
    {
        $email = $this->argument('email');
        $roleName = $this->option('role');

        if (!in_array($roleName, ['ADMINISTRADOR', 'FUNCIONARIO'])) {
            $this->error("Role inválida. Use ADMINISTRADOR ou FUNCIONARIO.");
            return 1;
        }

        $user = $repo->buscarPorEmail($email);

        if (!$user) {
            $this->error("Usuário com email {$email} não encontrado.");
            return 1;
        }

        $role = $repo->buscarRolePorNome($roleName);
        if (!$role) {
            $this->error("Role {$roleName} não encontrada no banco de dados.");
            return 1;
        }

        // Atualizar a role do usuário
        $repo->atualizar($user->id, ['role_id' => $role->id]);

        // Se for administrador, não precisa associar permissões diretas, a role já dá acesso a tudo via AuthService
        if ($roleName === 'ADMINISTRADOR') {
            $this->info("Usuário {$email} promovido a ADMINISTRADOR com sucesso.");
            return 0;
        }

        // Se for funcionário, damos as permissões base da role (via sincronização ou deixamos apenas na role)
        // Como o seeder já vincula as permissões na Role de FUNCIONARIO, apenas definir a role_id é suficiente.
        $this->info("Usuário {$email} promovido a FUNCIONARIO com sucesso.");
        return 0;
    }
}
