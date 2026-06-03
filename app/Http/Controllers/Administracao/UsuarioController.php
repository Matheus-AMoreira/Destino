<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Identidade\UsuarioService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function __construct(
        private readonly UsuarioService $usuarioService,
        private readonly \App\Application\Comercial\CompraService $compraService,
    ) {}

    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'funcionarios');
        $termo = $request->input('q', '');
        $page = $request->integer('page', 1);

        $result = $this->usuarioService->listarCards($tab, $termo, $request->user()->id, $page);

        return Inertia::render('Administracao/Usuario/Listar', [
            'usuarios' => [
                'data' => $result->items,
                'current_page' => $result->page,
                'last_page' => $result->lastPage(),
                'total' => $result->total,
                'links' => [],
            ],
            'tab' => $tab,
            'filters' => [
                'q' => $termo,
                'tab' => $tab,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Usuario/Registrar', [
            'roles' => $this->usuarioService->listarRoles(true, true),
            'permissions' => $this->usuarioService->listarPermissions(true), 
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:50'],
            'sobre_nome' => ['required', 'string', 'max:50'],
            'telefone' => ['required', 'string', 'max:20'],
            'cpf' => ['required', 'string', 'size:14'],
            'email' => ['required', 'string', 'email', 'max:100'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role_id' => ['required', 'exists:roles,id'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $permissoesIds = $dados['permissions'] ?? [];
        unset($dados['permissions'], $dados['password_confirmation']);

        try {
            $this->usuarioService->criarFuncionario($dados, $permissoesIds);
            return redirect()->route('administracao.usuario.index', ['tab' => 'funcionarios'])->with('success', 'Funcionário criado.');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['email' => $e->getMessage()])->withInput();
        }
    }

    public function edit(string $nome, string $id): Response
    {
        $realId = UsuarioService::decryptId($id);
        $usuario = $this->usuarioService->buscarPorId($realId);
        if (!$usuario) abort(404);

        $userPermsIds = $this->usuarioService->buscarIdsPermissoesDiretasDoUsuario($realId);
        $allPermissions = $this->usuarioService->listarPermissions(false);
        
        $userPermissions = [];
        foreach ($allPermissions as $perm) {
            if (in_array($perm->id, $userPermsIds)) {
                $userPermissions[] = [
                    'id' => $perm->id,
                    'slug' => $perm->slug,
                    'description' => $perm->description,
                    'is_staff' => $perm->isStaff,
                ];
            }
        }

        $role = $usuario->roleId ? $this->usuarioService->buscarRolePorId($usuario->roleId) : null;
        $compras = $this->compraService->listarComprasDoUsuarioParaAdmin($realId);

        return Inertia::render('Administracao/Usuario/Detalhes', [
            'usuario' => [
                'id' => UsuarioService::encryptId($realId),
                'nome' => $usuario->nome,
                'sobre_nome' => $usuario->sobreNome,
                'email' => $usuario->email,
                'telefone' => $usuario->telefone,
                'role_id' => $usuario->roleId,
                'role' => $role ? [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'is_staff' => $role->isStaff,
                ] : null,
                'is_valid' => $usuario->isValid,
                'permissions' => $userPermissions,
            ],
            'compras' => $compras,
            'roles' => array_map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'description' => $r->description,
                'is_staff' => $r->isStaff,
            ], $this->usuarioService->listarRoles(false, true)),
            'permissions' => array_map(fn($p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'description' => $p->description,
                'is_staff' => $p->isStaff,
            ], $this->usuarioService->listarPermissions(false)),
        ]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $realId = UsuarioService::decryptId($id);
        $usuario = $this->usuarioService->buscarPorId($realId);
        if (!$usuario) abort(404);

        $dados = $request->validate([
            'nome' => ['sometimes', 'required', 'string', 'max:50'],
            'sobre_nome' => ['sometimes', 'required', 'string', 'max:50'],
            'telefone' => ['sometimes', 'required', 'string', 'max:20'],
            'cpf' => ['sometimes', 'required', 'string', 'max:20'],
            'role_id' => ['sometimes', 'required', 'exists:roles,id'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
            'is_valid' => ['sometimes', 'boolean'],
        ]);

        // Bloquear promoção a ADMINISTRADOR por qualquer via
        if (isset($dados['role_id'])) {
            $targetRole = $this->usuarioService->buscarRolePorId((int) $dados['role_id']);
            if ($targetRole && $targetRole->name === 'ADMINISTRADOR') {
                abort(403, 'Não é permitido promover usuários a Administrador.');
            }

            // Apenas ADMINISTRADOR pode alterar o cargo de um usuário
            $currentAuthRole = $request->user()->role_id
                ? $this->usuarioService->buscarRolePorId($request->user()->role_id)
                : null;
            if (!$currentAuthRole || $currentAuthRole->name !== 'ADMINISTRADOR') {
                unset($dados['role_id']);
            }
        }

        $permissoesIds = $dados['permissions'] ?? [];
        unset($dados['permissions']);

        $this->usuarioService->atualizarFuncionario($realId, $dados, $permissoesIds);

        $roleId = $dados['role_id'] ?? $usuario->roleId;
        $role = $roleId ? $this->usuarioService->buscarRolePorId($roleId) : null;
        $tab = ($role && !$role->isStaff) ? 'clientes' : 'funcionarios';

        return redirect()->route('administracao.usuario.index', ['tab' => $tab])->with('success', 'Usuário atualizado.');
    }

    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $realId = UsuarioService::decryptId($id);
        $isValid = $request->input('is_valid');
        $this->usuarioService->bloquearOuDesbloquear($realId, $isValid);
        
        return back()->with('success', 'Status atualizado com sucesso.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $realId = UsuarioService::decryptId($id);
        $this->usuarioService->deletar($realId);
        return back()->with('success', 'Usuário deletado com sucesso.');
    }
}
