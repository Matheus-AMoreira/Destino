<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Cadastro');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'cpf' => preg_replace('/\D/', '', $request->cpf),
            'telefone' => preg_replace('/\D/', '', $request->telefone),
        ]);

        $request->validate([
            'nome' => 'required|string|max:20',
            'sobre_nome' => 'required|string|max:20',
            'cpf' => 'required|string|size:11',
            'telefone' => 'required|string|min:10|max:11',
            'email' => 'required|string|lowercase|email|max:100',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Verificação de unicidade com mensagem genérica para não revelar quais dados já existem
        $jaExiste = User::where('email', $request->email)->orWhere('cpf', $request->cpf)->exists();
        if ($jaExiste) {
            throw ValidationException::withMessages([
                'email' => 'Os dados informados já estão associados a uma conta. Verifique o e-mail ou CPF e tente novamente.',
            ]);
        }

        $User = User::create([
            'nome' => $request->nome,
            'sobre_nome' => $request->sobre_nome,
            'cpf' => $request->cpf,
            'telefone' => $request->telefone,
            'email' => $request->email,
            'password' => $request->password,
            'role_id' => \App\Models\Role::where('name', UserRole::USUARIO->value)->first()->id,
            'is_valid' => true,
        ]);

        event(new Registered($User));

        Auth::login($User);

        return redirect(route('verification.notice', absolute: false));
    }
}
