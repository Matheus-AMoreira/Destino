<?php

namespace App\Http\Controllers\Identidade;

use App\Actions\Identidade\AtualizarPerfilAction;
use App\Actions\Identidade\AtualizarSenhaAction;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PerfilController extends Controller
{
    public function __construct(
        private readonly AtualizarPerfilAction $atualizarPerfilAction,
        private readonly AtualizarSenhaAction $atualizarSenhaAction,
    ) {}

    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        $cpf = $user->cpf ? $user->cpf->value : '';
        $cpfMascarado = $user->cpf ? $user->cpf->masked() : '';

        return Inertia::render('Usuario/Perfil/Editar', [
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'sobre_nome' => $user->sobre_nome,
                'email' => $user->email,
                'telefone' => $user->telefone,
                'cpf' => $cpf,
                'cpf_mascarado' => $cpfMascarado,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'min:3', 'max:50', 'regex:/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/'],
            'sobre_nome' => ['required', 'string', 'min:3', 'max:50', 'regex:/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($request->user()->id),
            ],
            'telefone' => ['required', 'string', 'regex:/^\d+$/', 'between:10,11'],
            'cpf' => ['required', 'string', 'regex:/^\d+$/', 'size:11'],
        ], [
            'nome.regex' => 'O nome deve conter apenas letras.',
            'sobre_nome.regex' => 'O sobrenome deve conter apenas letras.',
            'email.unique' => 'Este e-mail já está associado a outra conta.',
            'cpf.regex' => 'O CPF deve conter apenas números.',
            'telefone.regex' => 'O telefone deve conter apenas números.',
        ]);

        unset($dados['cpf']);

        $user = $request->user();
        $this->atualizarPerfilAction->execute($user, $dados);

        return back()->with('success', 'Perfil updated.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (!Hash::check($request->input('current_password'), $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['A senha atual está incorreta.'],
            ]);
        }

        $this->atualizarSenhaAction->execute($user, $request->input('password'));

        return back()->with('success', 'Senha atualizada com sucesso.');
    }
}
