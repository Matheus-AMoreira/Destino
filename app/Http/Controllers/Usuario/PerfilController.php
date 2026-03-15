<?php

namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PerfilController extends Controller
{
    /**
     * Show the profile edit form.
     */
    public function edit(): Response
    {
        return Inertia::render('Usuario/Perfil/Editar', [
            'user' => auth()->user(),
        ]);
    }

    /**
     * Update user profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = auth()->user();

        $request->validate([
            'nome' => 'required|string|max:255',
            'sobre_nome' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
            'cpf' => "required|string|unique:users,cpf,{$user->id}",
        ]);

        /** @var User $user */
        $user->fill($request->only(['nome', 'sobre_nome', 'email', 'cpf']))->save();

        return back()->with('success', 'Perfil atualizado com sucesso.');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'current_password.current_password' => 'A senha atual está incorreta.',
            'password.required' => 'O campo nova senha é obrigatório.',
            'password.confirmed' => 'A confirmação da nova senha não confere.',
            'password.min' => 'A nova senha deve ter pelo menos :min caracteres.',
            'password.mixed' => 'A nova senha deve conter letras maiúsculas e minúsculas.',
            'password.letters' => 'A nova senha deve conter pelo menos uma letra.',
            'password.numbers' => 'A nova senha deve conter pelo menos um número.',
            'password.symbols' => 'A nova senha deve conter pelo menos um símbolo.',
            'password.uncompromised' => 'A senha informada apareceu em um vazamento de dados. Por favor, escolha outra senha.',
        ]);

        /** @var User $user */
        $user = auth()->user();

        if (Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'A nova senha não pode ser igual à senha atual.']);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Senha alterada com sucesso.');
    }

    /**
     * Admin update of a user's profile.
     */
    public function adminUpdate(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'sobre_nome' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
            'cpf' => "required|string|unique:users,cpf,{$user->id}",
        ]);

        $user->fill($request->only(['nome', 'sobre_nome', 'email', 'cpf']))->save();

        return back()->with('success', "Perfil de {$user->nome} atualizado com sucesso.");
    }
}
