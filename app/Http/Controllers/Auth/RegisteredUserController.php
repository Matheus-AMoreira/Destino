<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Shared\ValueObjects\Cpf;
use App\Domain\Shared\ValueObjects\Email;
use App\Domain\Shared\ValueObjects\Telefone;
use App\Enums\UserRole;
use Illuminate\Routing\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
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

        // Value Objects — validação de domínio
        try {
            $emailVO    = new Email($request->email);
            $cpfVO      = new Cpf($request->cpf);
            $telefoneVO = new Telefone($request->telefone);
        } catch (\InvalidArgumentException $e) {
            throw ValidationException::withMessages(['email' => $e->getMessage()]);
        }

        // Verificação de unicidade com mensagem genérica para não revelar quais dados já existem
        $jaExiste = User::where('email', $emailVO->value)
            ->orWhere('cpf', $cpfVO->value)
            ->exists();

        if ($jaExiste) {
            throw ValidationException::withMessages([
                'email' => 'Os dados informados já estão associados a uma conta. Verifique o e-mail ou CPF e tente novamente.',
            ]);
        }

        $roleId = DB::table('roles')->where('name', UserRole::USUARIO->value)->value('id');

        $user = User::create([
            'nome'       => $request->nome,
            'sobre_nome' => $request->sobre_nome,
            'cpf'        => $cpfVO->value,
            'telefone'   => $telefoneVO->value,
            'email'      => $emailVO->value,
            'password'   => $request->password,
            'role_id'    => $roleId,
            'is_valid'   => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('verification.notice', absolute: false));
    }
}
