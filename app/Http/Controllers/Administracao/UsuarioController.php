<?php

namespace App\Http\Controllers\Administracao;

use App\Enums\UserAuthority;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $termo = $request->get('termo');

        $query = User::query()->where(fn ($q) => $q->where('id', '!=', auth()->id()));

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                $q->where('nome', 'like', "%{$termo}%")
                    ->orWhere('email', 'like', "%{$termo}%")
                    ->orWhere('cpf', 'like', "%{$termo}%");
            });
        }

        $usuarios = $query->paginate(20)->withQueryString();

        return Inertia::render('Administracao/Usuario/Listar', [
            'usuarios' => $usuarios,
            'filters' => [
                'termo' => $termo,
            ],
            'roles' => UserRole::cases(),
            'authorities' => UserAuthority::cases(),
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
            'usuario' => $user,
            'compras' => $compras,
            'roles' => UserRole::cases(),
            'authorities' => UserAuthority::cases(),
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
     * Update user role and authorities.
     */
    public function updateAccess(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => ['required', Rule::enum(UserRole::class)],
            'authorities' => 'nullable|array',
            'authorities.*' => [Rule::enum(UserAuthority::class)],
        ]);

        if ($user->id === auth()->id()) {
            abort(403, 'Você não pode alterar seus próprios acessos por aqui.');
        }

        $user->fill([
            'role' => $request->role,
            'authorities' => $request->authorities ?? [],
        ])->save();

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
}
