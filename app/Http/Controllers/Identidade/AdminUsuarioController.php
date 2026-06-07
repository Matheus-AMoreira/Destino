<?php

namespace App\Http\Controllers\Identidade;

use App\Models\Identidade\Usuario;
use App\Models\Identidade\Role;
use App\Models\Identidade\Permission;
use App\Repositories\Identidade\UsuarioRepository;
use App\Actions\Identidade\CriarUsuarioAction;
use App\Actions\Identidade\AtualizarUsuarioAction;
use App\Services\Identidade\AuditService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminUsuarioController extends Controller
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository,
        private readonly CriarUsuarioAction $criarAction,
        private readonly AtualizarUsuarioAction $atualizarAction,
        private readonly AuditService $auditService,
    ) {}

    public function index(Request $request): Response
    {
        $authUser = $request->user();
        $canViewStaff = $authUser->hasPermission('user-staff:read');
        $canCreateStaff = $authUser->hasPermission('user-staff:create');

        $tab = $request->input('tab', 'funcionarios');
        $termo = $request->input('q', '');
        $page = $request->integer('page', 1);
        $perPage = 20;

        // Se o funcionário não tem permissão para ver staff, forçar aba clientes
        if (!$canViewStaff && $tab === 'funcionarios') {
            $tab = 'clientes';
        }

        $isStaff = $tab === 'funcionarios';

        $query = Usuario::query()
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.is_staff', $isStaff)
            ->where('users.id', '!=', $authUser->id)
            ->select('users.*', 'roles.name as role_name');

        $users = $query->latest('users.created_at')->get();

        if ($termo) {
            $cleanTermo = preg_replace('/\D/', '', $termo);
            $users = $users->filter(function (Usuario $u) use ($termo, $cleanTermo) {
                $nomeCompleto = $u->nome . ' ' . $u->sobre_nome;
                $matchNome = stripos($nomeCompleto, $termo) !== false;
                $matchEmail = stripos($u->email, $termo) !== false;
                
                $matchCpf = false;
                if ($u->cpf) {
                    $matchCpf = stripos($u->cpf->value, $cleanTermo) !== false;
                }
                
                return $matchNome || $matchEmail || $matchCpf;
            });
        }

        $total = $users->count();
        $items = $users->slice(($page - 1) * $perPage, $perPage)->values();

        $dtos = $items->map(function (Usuario $u) use ($isStaff) {
            $perms = $u->permissions->pluck('slug')->map(fn($p) => ['slug' => $p])->toArray();
            $cpfMascarado = $u->cpf ? $u->cpf->masked() : '';

            return [
                'id' => Usuario::encryptId($u->id),
                'nome' => $u->nome,
                'sobre_nome' => $u->sobre_nome,
                'cpf_mascarado' => $cpfMascarado,
                'email' => $u->email,
                'telefone' => $u->telefone,
                'role_name' => $u->role_name ?? '',
                'is_staff' => $isStaff,
                'is_valid' => $u->is_valid,
                'permissions' => $perms,
            ];
        })->toArray();

        return Inertia::render('Administracao/Usuario/Listar', [
            'usuarios' => [
                'data' => $dtos,
                'current_page' => $page,
                'last_page' => (int) ceil($total / $perPage),
                'total' => $total,
                'links' => [],
            ],
            'tab' => $tab,
            'filters' => [
                'q' => $termo,
                'tab' => $tab,
            ],
            // Flags de permissão para o frontend
            'canViewStaff' => $canViewStaff,
            'canCreateStaff' => $canCreateStaff,
        ]);
    }

    public function create(): Response
    {
        $roles = Role::query()
            ->where('is_staff', true)
            ->where('name', '!=', 'ADMINISTRADOR')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'description' => $r->description,
                'is_staff' => $r->is_staff,
            ])
            ->toArray();

        $permissions = Permission::query()
            ->where('is_staff', true)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'description' => $p->description,
                'is_staff' => $p->is_staff,
            ])
            ->toArray();

        return Inertia::render('Administracao/Usuario/Registrar', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:50'],
            'sobre_nome' => ['required', 'string', 'max:50'],
            'telefone' => ['nullable', 'string', 'max:20'],
            'cpf' => ['required', 'string'],
            'email' => ['required', 'string', 'email', 'max:100', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role = Role::find((int) $dados['role_id']);
        if (!$role || !$role->is_staff || $role->name === 'ADMINISTRADOR') {
            abort(403, 'Ação não permitida.');
        }

        $cleanCpf = preg_replace('/\D/', '', $dados['cpf']);

        $cpfExists = Usuario::all()->contains(fn($u) => $u->cpf?->value === $cleanCpf);
        if ($cpfExists) {
            return back()->withErrors(['cpf' => 'O CPF informado já está associado a uma conta.'])->withInput();
        }

        $dados['cpf'] = $cleanCpf;
        $dados['id'] = (string) \Illuminate\Support\Str::uuid();
        $dados['is_valid'] = false; // Começa inativo até o onboarding

        if (!empty($dados['telefone'])) {
            $dados['telefone'] = preg_replace('/\D/', '', $dados['telefone']);
        } else {
            $dados['telefone'] = 'Não informado';
        }

        list($usuario, $plainPassword) = $this->criarAction->execute($dados);

        // Registrar no log de auditoria
        $this->auditService->logUserCreated(
            $usuario->id,
            "Funcionário '{$usuario->nome} {$usuario->sobre_nome}' criado com cargo '{$role->name}'"
        );

        session()->flash('invitation_password', $plainPassword);

        return redirect()->route('administracao.usuario.index', ['tab' => 'funcionarios'])->with('success', 'Funcionário criado.');
    }

    public function edit(Request $request, string $nome, string $id): Response
    {
        $realId = Usuario::decryptId($id);
        $usuario = $this->usuarioRepository->buscarPorId($realId);
        if (!$usuario) abort(404);

        $authUser = $request->user();
        $targetIsStaff = $usuario->role && $usuario->role->is_staff;

        // Verificar permissão baseada no tipo do alvo
        if ($targetIsStaff) {
            if (!$authUser->hasPermission('user-staff:update')) {
                abort(403, 'Você não tem permissão para ver detalhes de funcionários.');
            }
        } else {
            if (!$authUser->hasPermission('user-client:update') && !$authUser->hasPermission('user-client:read')) {
                abort(403, 'Você não tem permissão para ver detalhes de clientes.');
            }
        }

        // Flags de permissão para o frontend
        $canManageRole = $authUser->hasPermission('user:manage-role');
        $canManagePermissions = $authUser->hasPermission('user:manage-permissions');
        $canEditProfile = $targetIsStaff
            ? $authUser->hasPermission('user-staff:update')
            : $authUser->hasPermission('user-client:update');

        $userPermissions = $usuario->permissions->map(fn($p) => [
            'id' => $p->id,
            'slug' => $p->slug,
            'description' => $p->description,
            'is_staff' => $p->is_staff,
        ])->toArray();

        $compras = \App\Models\Comercial\Compra::with([
            'oferta.pacote',
            'oferta.hotel.cidade'
        ])
        ->where('user_id', $realId)
        ->get()
        ->map(fn($c) => [
            'id' => $c->id,
            'data_compra' => $c->data_compra ? $c->data_compra->toIso8601String() : null,
            'status' => $c->status,
            'valor_final' => (float)$c->valor_final,
            'oferta' => $c->oferta ? [
                'inicio' => $c->oferta->inicio,
                'fim' => $c->oferta->fim,
                'pacote' => $c->oferta->pacote ? [
                    'id' => $c->oferta->pacote->id,
                    'nome' => $c->oferta->pacote->nome,
                ] : null,
                'hotel' => $c->oferta->hotel ? [
                    'cidade' => $c->oferta->hotel->cidade ? [
                        'nome' => $c->oferta->hotel->cidade->nome,
                    ] : null,
                ] : null,
            ] : null,
        ])
        ->toArray();


        $roles = Role::query()
            ->where('name', '!=', 'ADMINISTRADOR')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'description' => $r->description,
                'is_staff' => $r->is_staff,
            ])
            ->toArray();

        $permissions = Permission::all()
            ->map(fn($p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'description' => $p->description,
                'is_staff' => $p->is_staff,
            ])
            ->toArray();

        return Inertia::render('Administracao/Usuario/Detalhes', [
            'usuario' => [
                'id' => Usuario::encryptId($realId),
                'nome' => $usuario->nome,
                'sobre_nome' => $usuario->sobre_nome,
                'email' => $usuario->email,
                'telefone' => $usuario->telefone,
                'role_id' => $usuario->role_id,
                'role' => $usuario->role ? [
                    'id' => $usuario->role->id,
                    'name' => $usuario->role->name,
                    'description' => $usuario->role->description,
                    'is_staff' => $usuario->role->is_staff,
                ] : null,
                'is_valid' => $usuario->is_valid,
                'permissions' => $userPermissions,
            ],
            'compras' => $compras,
            'roles' => $roles,
            'permissions' => $permissions,
            // Flags de permissão para o frontend
            'canManageRole' => $canManageRole,
            'canManagePermissions' => $canManagePermissions,
            'canEditProfile' => $canEditProfile,
        ]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $realId = Usuario::decryptId($id);
        $usuario = $this->usuarioRepository->buscarPorId($realId);
        if (!$usuario) abort(404);

        $authUser = $request->user();
        $targetIsStaff = $usuario->role && $usuario->role->is_staff;

        // Verificar permissão de edição baseada no tipo do alvo
        if ($targetIsStaff) {
            if (!$authUser->hasPermission('user-staff:update')) {
                abort(403, 'Você não tem permissão para editar funcionários.');
            }
        } else {
            if (!$authUser->hasPermission('user-client:update')) {
                abort(403, 'Você não tem permissão para editar clientes.');
            }
        }

        $dados = $request->validate([
            'nome' => ['sometimes', 'required', 'string', 'max:50'],
            'sobre_nome' => ['sometimes', 'required', 'string', 'max:50'],
            'telefone' => ['sometimes', 'required', 'string', 'max:20'],
            'cpf' => ['sometimes', 'required', 'string'],
            'role_id' => ['sometimes', 'required', 'exists:roles,id'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
            'is_valid' => ['sometimes', 'boolean'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        // Bloquear alteração de cargo se não tiver permissão
        if (isset($dados['role_id'])) {
            if (!$authUser->hasPermission('user:manage-role')) {
                abort(403, 'Você não tem permissão para alterar cargos.');
            }

            $targetRole = Role::find((int) $dados['role_id']);
            if ($targetRole && $targetRole->name === 'ADMINISTRADOR') {
                abort(403, 'Não é permitido promover usuários a Administrador.');
            }

            // Bloquear promoção de Cliente para Staff
            $oldRole = $usuario->role;
            if ($oldRole && !$oldRole->is_staff && $targetRole->is_staff) {
                abort(403, 'Um cliente não pode ser promovido a funcionário por segurança. Crie uma conta institucional.');
            }

            // Registrar mudança de cargo no log
            if ($oldRole && (int) $oldRole->id !== (int) $dados['role_id']) {
                $this->auditService->logRoleUpdate(
                    $realId,
                    $oldRole->name,
                    $targetRole->name
                );
            }
        }

        // Bloquear alteração de permissões se não tiver permissão
        if (isset($dados['permissions'])) {
            if (!$authUser->hasPermission('user:manage-permissions')) {
                abort(403, 'Você não tem permissão para alterar permissões.');
            }

            // Registrar mudança de permissões no log
            $oldSlugs = $usuario->permissions->pluck('slug')->sort()->values()->toArray();
            $newPermIds = $dados['permissions'];
            $newSlugs = Permission::whereIn('id', $newPermIds)->pluck('slug')->sort()->values()->toArray();

            if ($oldSlugs !== $newSlugs) {
                $this->auditService->logPermissionsUpdate($realId, $oldSlugs, $newSlugs);
            }
        }

        if (isset($dados['telefone'])) {
            $dados['telefone'] = preg_replace('/\D/', '', $dados['telefone']);
        }
        if (!empty($dados['cpf'])) {
            $cleanCpf = preg_replace('/\D/', '', $dados['cpf']);
            $cpfExists = Usuario::query()->where('id', '!=', $realId)->get()->contains(fn($u) => $u->cpf?->value === $cleanCpf);
            if ($cpfExists) {
                return back()->withErrors(['cpf' => 'O CPF informado já está associado a uma conta.'])->withInput();
            }
            $dados['cpf'] = $cleanCpf;
        }

        if (!empty($dados['password'])) {
            $dados['password'] = \Illuminate\Support\Facades\Hash::make($dados['password']);
        }

        // Capturar dados antigos para log de perfil
        $oldProfileData = [
            'nome' => $usuario->nome,
            'sobre_nome' => $usuario->sobre_nome,
            'email' => $usuario->email,
            'telefone' => $usuario->telefone,
        ];

        $this->atualizarAction->execute($usuario, $dados);

        // Registrar alterações de perfil no log
        $newProfileData = [
            'nome' => $dados['nome'] ?? $oldProfileData['nome'],
            'sobre_nome' => $dados['sobre_nome'] ?? $oldProfileData['sobre_nome'],
            'email' => $dados['email'] ?? $oldProfileData['email'],
            'telefone' => $dados['telefone'] ?? $oldProfileData['telefone'],
        ];
        $this->auditService->logProfileUpdate($realId, $oldProfileData, $newProfileData);

        $role = $usuario->fresh()->role;
        $tab = ($role && !$role->is_staff) ? 'clientes' : 'funcionarios';

        return redirect()->route('administracao.usuario.index', ['tab' => $tab])->with('success', 'Usuário atualizado.');
    }

    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $realId = Usuario::decryptId($id);
        $usuario = $this->usuarioRepository->buscarPorId($realId);
        if (!$usuario) abort(404);

        $authUser = $request->user();
        $targetIsStaff = $usuario->role && $usuario->role->is_staff;

        // Verificar permissão baseada no tipo do alvo
        if ($targetIsStaff) {
            if (!$authUser->hasPermission('user-staff:status')) {
                abort(403, 'Você não tem permissão para alterar status de funcionários.');
            }
        } else {
            if (!$authUser->hasPermission('user-client:status')) {
                abort(403, 'Você não tem permissão para alterar status de clientes.');
            }
        }

        $oldStatus = $usuario->is_valid;
        $usuario->is_valid = (bool) $request->input('is_valid');
        $usuario->save();

        // Registrar no log de auditoria
        $this->auditService->logStatusUpdate($realId, $oldStatus, $usuario->is_valid);

        return back()->with('success', 'Status atualizado com sucesso.');
    }

    public function resendInvitation(string $id): RedirectResponse
    {
        $realId = Usuario::decryptId($id);
        $usuario = $this->usuarioRepository->buscarPorId($realId);
        if (!$usuario || !$usuario->role?->is_staff) {
            abort(403, 'Ação não permitida.');
        }

        $plainPassword = \Illuminate\Support\Str::random(10);
        $usuario->password = \Illuminate\Support\Facades\Hash::make($plainPassword);
        $usuario->save();

        // Registrar no log de auditoria
        $this->auditService->logUserCreated(
            $usuario->id,
            "Nova senha temporária do funcionário '{$usuario->nome} {$usuario->sobre_nome}' gerada"
        );

        session()->flash('invitation_password', $plainPassword);

        return back()->with('success', 'Nova senha temporária gerada e exibida com sucesso.');
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $realId = Usuario::decryptId($id);
        $usuario = $this->usuarioRepository->buscarPorId($realId);
        if ($usuario) {
            if ($usuario->role && $usuario->role->is_staff) {
                abort(403, 'Funcionários não podem ser deletados.');
            }

            // Registrar no log de auditoria antes de deletar
            $this->auditService->logUserDeleted(
                $realId,
                "Cliente '{$usuario->nome} {$usuario->sobre_nome}' ({$usuario->email}) deletado"
            );

            $usuario->delete();
        }
        return back()->with('success', 'Usuário deletado com sucesso.');
    }
}
