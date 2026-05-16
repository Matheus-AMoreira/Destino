<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Shared\ValueObjects\Cpf;
use App\Domain\Shared\ValueObjects\Email;
use App\Domain\Shared\ValueObjects\Telefone;
use App\Domain\Identidade\Enums\UserRole;
use Illuminate\Routing\Controller;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private readonly UsuarioRepositoryInterface $usuarioRepo,
    ) {}

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
        $jaExiste = $this->usuarioRepo->existePorEmailOuCpf($emailVO->value, $cpfVO->value);

        if ($jaExiste) {
            throw ValidationException::withMessages([
                'email' => 'Os dados informados já estão associados a uma conta. Verifique o e-mail ou CPF e tente novamente.',
            ]);
        }

        $role = $this->usuarioRepo->buscarRolePorNome(UserRole::USUARIO->value);
        $roleId = $role?->id;

        $id = (string) Str::uuid();

        $this->usuarioRepo->criar([
            'id'         => $id,
            'nome'       => $request->nome,
            'sobre_nome' => $request->sobre_nome,
            'cpf'        => Crypt::encryptString($cpfVO->value),
            'telefone'   => $telefoneVO->value,
            'email'      => $emailVO->value,
            'password'   => Hash::make($request->password),
            'role_id'    => $roleId,
            'is_valid'   => true,
        ]);

        $user = User::find($id);

        if ($user) {
            event(new Registered($user));
            Auth::login($user);
        }

        return redirect(route('verification.notice', absolute: false));
    }
}
