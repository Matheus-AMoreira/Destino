<?php

namespace App\Http\Controllers\Usuario;

use App\Application\Identidade\PerfilService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

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
            'nome' => ['required', 'string', 'max:50'],
            'sobre_nome' => ['required', 'string', 'max:50'],
            'telefone' => ['required', 'string', 'max:20'],
            'cpf' => ['required', 'string', 'size:14'],
        ]);

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
