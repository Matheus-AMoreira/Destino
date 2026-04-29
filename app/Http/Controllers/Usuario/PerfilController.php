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
    public function edit(User $user): Response
    {
        // Apenas o próprio usuário pode ver/editar seu perfil
        if (auth()->id() !== $user->id) {
            abort(403);
        }

        $user->makeVisible(['cpf']);

        return Inertia::render('Usuario/Perfil/Editar', [
            'user' => $user,
        ]);
    }

    /**
     * Update user profile information.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        // Apenas o próprio usuário pode atualizar seu perfil
        if (auth()->id() !== $user->id) {
            abort(403);
        }

        $request->merge([
            'telefone' => preg_replace('/\D/', '', $request->telefone ?? ''),
        ]);

        $regras = [
            'nome' => 'required|string|max:255',
            'sobre_nome' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
            'telefone' => 'nullable|string|max:11',
        ];

        // Se o CPF contém asteriscos, é a máscara. Não tentamos validar nem atualizar.
        $atualizarCpf = !str_contains($request->cpf, '*');

        if ($atualizarCpf) {
            $request->merge(['cpf' => preg_replace('/\D/', '', $request->cpf)]);
            $regras['cpf'] = "required|string|size:11|unique:users,cpf,{$user->id}";
        }

        $request->validate($regras, [
            'cpf.size' => 'O CPF deve conter exatamente 11 números.',
            'telefone.max' => 'O telefone não pode ter mais de 11 dígitos.',
        ]);

        /** @var User $user */
        $campos = ['nome', 'sobre_nome', 'email', 'telefone'];
        if ($atualizarCpf) {
            $campos[] = 'cpf';
        }

        $user->fill($request->only($campos))->save();

        return back()->with('success', 'Perfil atualizado com sucesso.');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        // Apenas o próprio usuário pode alterar sua senha
        if (auth()->id() !== $user->id) {
            abort(403);
        }

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

        if (Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'A nova senha não pode ser igual à senha atual.']);
        }

        $user->update([
            'password' => $request->password,
        ]);

        return back()->with('success', 'Senha alterada com sucesso.');
    }

    /**
     * Admin update of a user's profile.
     */
    public function adminUpdate(Request $request, User $user): RedirectResponse
    {
        $request->merge([
            'telefone' => preg_replace('/\D/', '', $request->telefone ?? ''),
        ]);

        $regras = [
            'nome' => 'required|string|max:255',
            'sobre_nome' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
            'telefone' => 'nullable|string|max:11',
        ];

        $atualizarCpf = !str_contains($request->cpf, '*');

        if ($atualizarCpf) {
            $request->merge(['cpf' => preg_replace('/\D/', '', $request->cpf)]);
            $regras['cpf'] = "required|string|size:11|unique:users,cpf,{$user->id}";
        }

        $request->validate($regras, [
            'cpf.size' => 'O CPF deve conter exatamente 11 números.',
            'telefone.max' => 'O telefone não pode ter mais de 11 dígitos.',
        ]);

        $campos = ['nome', 'sobre_nome', 'email', 'telefone'];
        if ($atualizarCpf) {
            $campos[] = 'cpf';
        }

        $user->fill($request->only($campos))->save();

        return back()->with('success', "Perfil de {$user->nome} atualizado com sucesso.");
    }
}
