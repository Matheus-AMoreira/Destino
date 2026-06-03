<?php

namespace App\Http\Controllers\Usuario;

use App\Application\Identidade\PerfilService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use Illuminate\Validation\Rule;

class PerfilController extends Controller
{
    public function __construct(
        private readonly PerfilService $perfilService,
    ) {}

    public function edit(Request $request): Response
    {
        $perfil = $this->perfilService->buscarPerfil($request->user()->id);

        return Inertia::render('Usuario/Perfil/Editar', [
            'user' => $perfil,
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

        // Como o CPF é somente leitura e um identificador único fixo,
        // nós validamos seu formato mas não o atualizamos no banco para segurança.
        unset($dados['cpf']);

        $this->perfilService->atualizarPerfil($request->user()->id, $dados);

        return back()->with('success', 'Perfil atualizado com sucesso.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $this->perfilService->atualizarSenha(
            $request->user()->id, 
            $request->input('current_password'), 
            $request->input('password')
        );

        return back()->with('success', 'Senha atualizada com sucesso.');
    }
}
