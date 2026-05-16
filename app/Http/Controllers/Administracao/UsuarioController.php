<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Identidade\UsuarioService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function __construct(
        private readonly UsuarioService $usuarioService,
    ) {}

    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'funcionarios'); // 'funcionarios' ou 'clientes'
        $termo = $request->input('q', '');
        $page = $request->integer('page', 1);

        $result = $this->usuarioService->listarCards($tab, $termo, $request->user()->id, $page);

        return Inertia::render('Administracao/Usuario/Listar', [
            'usuarios' => [
                'data' => $result->items,
                'current_page' => $result->page,
                'last_page' => $result->lastPage(),
                'total' => $result->total,
                'links' => [], // Add empty links if not used for now to avoid crashes
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
            'roles' => $this->usuarioService->listarRoles(true, true), // Staff only, exclude Admin
            'permissions' => $this->usuarioService->listarPermissions(true), // Staff perms
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
        $realId = base64_decode($id, true) ?: $id;
        $usuario = $this->usuarioService->buscarPorId($realId);
        if (!$usuario) abort(404);

        $userPerms = \Illuminate\Support\Facades\DB::table('user_permissions')->where('user_id', $realId)->pluck('permission_id')->all();

        return Inertia::render('Administracao/Usuario/Detalhes', [
            'usuario' => [
                'id' => $realId,
                'nome' => $usuario->nome,
                'sobre_nome' => $usuario->sobreNome,
                'email' => $usuario->email,
                'telefone' => $usuario->telefone,
                'role_id' => $usuario->roleId,
                'is_valid' => $usuario->isValid,
                'permissions' => $userPerms,
            ],
            'roles' => $this->usuarioService->listarRoles(true, true),
            'permissions' => $this->usuarioService->listarPermissions(true),
        ]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $dados = $request->validate([
            'nome' => ['sometimes', 'required', 'string', 'max:50'],
            'sobre_nome' => ['sometimes', 'required', 'string', 'max:50'],
            'telefone' => ['sometimes', 'required', 'string', 'max:20'],
            'role_id' => ['sometimes', 'required', 'exists:roles,id'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
            'is_valid' => ['sometimes', 'boolean'],
        ]);

        $permissoesIds = $dados['permissions'] ?? [];
        unset($dados['permissions']);

        $this->usuarioService->atualizarFuncionario($id, $dados, $permissoesIds);

        return redirect()->route('administracao.usuario.index', ['tab' => 'funcionarios'])->with('success', 'Funcionário atualizado.');
    }

    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $isValid = $request->input('is_valid');
        $this->usuarioService->bloquearOuDesbloquear($id, $isValid);
        
        return back()->with('success', 'Status atualizado com sucesso.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->usuarioService->deletar($id);
        return back()->with('success', 'Usuário deletado com sucesso.');
    }
}
