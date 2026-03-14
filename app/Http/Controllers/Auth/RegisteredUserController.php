<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            'cpf' => 'required|string|size:11|unique:'.User::class,
            'telefone' => 'required|string|min:10|max:11',
            'email' => 'required|string|lowercase|email|max:100|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $User = User::create([
            'nome' => $request->nome,
            'sobre_nome' => $request->sobre_nome,
            'cpf' => $request->cpf,
            'telefone' => $request->telefone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => UserRole::USUARIO,
            'is_valid' => true,
        ]);

        event(new Registered($User));

        Auth::login($User);

        return redirect(route('verification.notice', absolute: false));
    }
}
