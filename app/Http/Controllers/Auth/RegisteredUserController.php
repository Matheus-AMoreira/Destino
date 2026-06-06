<?php

namespace App\Http\Controllers\Auth;

use App\Models\Identidade\Usuario;
use App\Models\Identidade\Role;
use Illuminate\Routing\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class RegisteredUserController extends Controller
{
    public function __construct() {}

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
            'cpf'      => preg_replace('/\D/', '', $request->cpf),
            'telefone' => preg_replace('/\D/', '', $request->telefone),
        ]);

        $request->validate([
            'nome'       => 'required|string|max:20',
            'sobre_nome' => 'required|string|max:20',
            'cpf'        => 'required|string|size:11',
            'telefone'   => 'required|string|min:10|max:11',
            'email'      => 'required|string|lowercase|email|max:100',
            'password'   => ['required', 'confirmed', Password::defaults()],
        ]);

        $emailExists = Usuario::where('email', $request->email)->exists();
        $cpfExists = Usuario::all()->contains(fn($u) => $u->cpf?->value === $request->cpf);

        if ($emailExists || $cpfExists) {
            throw ValidationException::withMessages([
                'email' => 'Usuário com este email ou cpf já existe.'
            ]);
        }

        $role = Role::where('name', 'USUARIO')->firstOrFail();

        $user = Usuario::create([
            'nome' => $request->nome,
            'sobre_nome' => $request->sobre_nome,
            'cpf' => $request->cpf,
            'telefone' => $request->telefone,
            'email' => $request->email,
            'password' => $request->password,
            'is_valid' => true,
            'role_id' => $role->id,
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect(route('verification.notice', absolute: false));
    }
}
