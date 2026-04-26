<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    /**
     * Show the form for creating a new employee.
     */
    public function create(): Response
    {
        return Inertia::render('Administracao/Usuario/Registrar', [
            'roles' => Role::where('is_staff', true)->where('name', '!=', 'ADMINISTRADOR')->get(),
            'permissions' => Permission::where('is_staff', true)->get(),
        ]);
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Sanitiza CPF e Telefone removendo tudo que não for número
        $request->merge([
            'cpf' => preg_replace('/\D/', '', $request->cpf),
            'telefone' => preg_replace('/\D/', '', $request->telefone),
        ]);

        $request->validate([
            'nome' => 'required|string|max:255',
            'sobre_nome' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'cpf' => 'required|string|size:11|unique:users,cpf',
            'telefone' => 'nullable|string|max:11',
            'role_id' => 'required|exists:roles,id',
        ], [
            'cpf.size' => 'O CPF deve conter exatamente 11 números.',
            'cpf.unique' => 'Este CPF já está cadastrado.',
            'telefone.max' => 'O telefone não pode ter mais de 11 dígitos.',
        ]);

        $role = Role::find($request->role_id);
        
        if (!$role) {
            return back()->withErrors(['role_id' => 'O cargo selecionado é inválido ou não existe.'])->withInput();
        }

        // Segurança: Apenas Staff pode ser criado aqui, e nunca Administrador
        if (!$role->is_staff || $role->name === 'ADMINISTRADOR') {
            abort(403, 'Ação não permitida.');
        }

        // Gera uma senha aleatória de 12 caracteres
        $plainPassword = \Illuminate\Support\Str::random(12);

        $user = User::create([
            'nome' => $request->nome,
            'sobre_nome' => $request->sobre_nome,
            'email' => $request->email,
            'cpf' => $request->cpf,
            'telefone' => $request->telefone ?? 'Não informado',
            'role_id' => $role->id,
            'password' => \Illuminate\Support\Facades\Hash::make($plainPassword),
            'is_valid' => false, // Começa bloqueado até o primeiro acesso/validação
        ]);

        // Aqui dispararíamos o e-mail:
        // Mail::to($user->email)->send(new WelcomeStaffMail($user, $plainPassword));
        
        // Como estamos simulando, vamos salvar a senha no log ou flash para testes
        session()->flash('invitation_password', $plainPassword);

        return redirect()->route('administracao.usuario.listar')->with('success', 'Funcionário cadastrado. O convite com a senha foi enviado para o e-mail.');
    }

    /**
     * Resend the invitation email to a staff member.
     */
    public function resendInvitation(User $user): RedirectResponse
    {
        if (!$user->role->is_staff) {
            abort(403);
        }

        $newPassword = \Illuminate\Support\Str::random(12);
        $user->password = \Illuminate\Support\Facades\Hash::make($newPassword);
        $user->save();

        // Simulação de reenvio
        session()->flash('invitation_password', $newPassword);

        return back()->with('success', 'Novo convite enviado com sucesso.');
    }

    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $termo = $request->get('termo');
        $tab = $request->get('tab', 'funcionarios'); // 'funcionarios' ou 'clientes'

        $query = User::query()
            ->with(['role', 'permissions'])
            ->whereKeyNot(auth()->id()); // Nunca mostra o próprio usuário (UUID safe)

        // Filtro por tipo (Staff vs Cliente)
        $query->whereHas('role', function ($q) use ($tab) {
            $q->where('is_staff', $tab === 'funcionarios');
        });

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                // CPF excluído da busca livre por ser dado pessoal sensível (LGPD)
                $q->where('nome', 'like', "%{$termo}%")
                    ->orWhere('email', 'like', "%{$termo}%");
            });
        }

        $usuarios = $query->paginate(20)->withQueryString();

        return Inertia::render('Administracao/Usuario/Listar', [
            'usuarios' => $usuarios,
            'filters' => [
                'termo' => $termo,
                'tab' => $tab,
            ],
            'roles' => Role::where('is_staff', true)->where('name', '!=', 'ADMINISTRADOR')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        if ($user->id === auth()->id()) {
            return Inertia::render('Usuario/Perfil/Editar', [
                'user' => $user,
            ]);
        }

        $compras = Compra::query()
            ->with(['oferta.pacote.fotos_do_pacote', 'oferta.hotel.cidade'])
            ->where('user_id', $user->id)
            ->latest('data_compra')
            ->get();

        return Inertia::render('Administracao/Usuario/Detalhes', [
            'usuario' => $user->load(['role', 'permissions']),
            'compras' => $compras,
            'roles' => Role::where('name', '!=', 'ADMINISTRADOR')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * Manually approve a user (verify email).
     */
    public function aprovar(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            abort(403, 'Você não pode se aprovar.');
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'is_valid' => true,
        ])->save();

        return back()->with('success', 'Usuário aprovado com sucesso.');
    }

    /**
     * Toggle user validity (block/unblock).
     */
    public function toggleBlock(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            abort(403, 'Você não pode se bloquear ou desbloquear.');
        }

        $user->is_valid = ! (bool) $user->is_valid;
        $user->save();

        $status = $user->is_valid ? 'desbloqueado' : 'bloqueado';

        return back()->with('success', "Usuário {$status} com sucesso.");
    }

    /**
     * Update user role and direct permissions.
     */
    public function updateAccess(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role_id' => ['required', 'exists:roles,id'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        if ($user->id === auth()->id()) {
            abort(403, 'Você não pode alterar seus próprios acessos por aqui.');
        }

        // Camada de Segurança Extra: Bloqueia promoção para ADMINISTRADOR
        $adminRole = Role::where('name', 'ADMINISTRADOR')->first();
        if ($adminRole && $request->role_id == $adminRole->id) {
            abort(403, 'Promoção para Administrador permitida apenas via banco de dados.');
        }

        // Nova Regra: Bloquear promoção de Cliente para Staff
        $oldRole = $user->role;
        $newRole = Role::find($request->role_id);
        if ($oldRole && !$oldRole->is_staff && $newRole->is_staff) {
            abort(403, 'Um cliente não pode ser promovido a funcionário por segurança. Crie uma conta institucional.');
        }

        // Atualiza o papel
        $user->role_id = $request->role_id;
        $user->save();

        // Validação Hierárquica: Impedir que não-staff receba permissões administrativo
        $selectedRole = Role::find($request->role_id);
        $permissionsToSync = $request->permissions ?? [];

        if (!$selectedRole->is_staff) {
            // Filtra apenas permissões que NÃO são staff
            $permissionsToSync = Permission::whereIn('id', $permissionsToSync)
                ->where('is_staff', false)
                ->pluck('id')
                ->toArray();
            
            if (count($request->permissions ?? []) > count($permissionsToSync)) {
                // Opcional: avisar que algumas foram removidas por segurança
                session()->flash('warning', 'Algumas permissões de Staff foram removidas pois o cargo selecionado não é administrativo.');
            }
        }

        // Sincroniza as permissões diretas
        $user->permissions()->sync($permissionsToSync);

        return back()->with('success', 'Acessos atualizados com sucesso.');
    }

    /**
     * Get user purchase history.
     */
    public function compras(User $user): JsonResponse
    {
        $compras = Compra::query()
            ->with(['oferta.pacote.fotos_do_pacote', 'oferta.hotel.cidade'])
            ->where('user_id', $user->id)
            ->latest('data_compra')
            ->get();

        return response()->json($compras);
    }
    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            abort(403, 'Você não pode excluir sua própria conta por aqui.');
        }

        // A proteção real está no modelo (booted), mas reforçamos aqui por clareza
        if ($user->role && $user->role->is_staff) {
            abort(403, 'Funcionários não podem ser deletados.');
        }

        $user->delete();

        return redirect()->route('administracao.usuario.listar')->with('success', 'Usuário excluído com sucesso.');
    }
}
