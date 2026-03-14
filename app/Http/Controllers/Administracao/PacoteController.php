<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administracao\StorePacoteRequest;
use App\Http\Requests\Administracao\UpdatePacoteRequest;
use App\Models\Pacote;
use App\Models\PacoteFoto;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PacoteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/Pacote/Index', [
            'pacotes' => Pacote::with(['funcionario', 'fotosDoPacote'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Pacote/Create', [
            'funcionarios' => User::where('tipo', 'ADMIN')->get(),
            'pacoteFotos' => PacoteFoto::all(),
        ]);
    }

    public function store(StorePacoteRequest $request): RedirectResponse
    {
        Pacote::create($request->validated());

        return redirect()->route('administracao.pacote.listar')
            ->with('success', 'Pacote criado com sucesso!');
    }

    public function edit(Pacote $pacote): Response
    {
        return Inertia::render('Administracao/Pacote/Edit', [
            'pacote' => $pacote,
            'funcionarios' => User::where('tipo', 'ADMIN')->get(),
            'pacoteFotos' => PacoteFoto::all(),
        ]);
    }

    public function update(UpdatePacoteRequest $request, Pacote $pacote): RedirectResponse
    {
        $pacote->update($request->validated());

        return redirect()->route('administracao.pacote.listar')
            ->with('success', 'Pacote atualizado com sucesso!');
    }

    public function destroy(Pacote $pacote): RedirectResponse
    {
        $pacote->delete();

        return redirect()->route('administracao.pacote.listar')
            ->with('success', 'Pacote excluído com sucesso!');
    }
}
