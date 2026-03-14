<?php

namespace App\Http\Controllers\Administracao;

use App\Enums\Meio;
use App\Http\Controllers\Controller;
use App\Http\Requests\Administracao\StoreTransporteRequest;
use App\Http\Requests\Administracao\UpdateTransporteRequest;
use App\Models\Transporte;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransporteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/Transporte/Index', [
            'transportes' => Transporte::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Transporte/Create', [
            'meios' => Meio::cases(),
        ]);
    }

    public function store(StoreTransporteRequest $request): RedirectResponse
    {
        Transporte::create($request->validated());

        return redirect()->route('administracao.transporte.listar')
            ->with('success', 'Transporte criado com sucesso!');
    }

    public function edit(Transporte $transporte): Response
    {
        return Inertia::render('Administracao/Transporte/Edit', [
            'transporte' => $transporte,
            'meios' => Meio::cases(),
        ]);
    }

    public function update(UpdateTransporteRequest $request, Transporte $transporte): RedirectResponse
    {
        $transporte->update($request->validated());

        return redirect()->route('administracao.transporte.listar')
            ->with('success', 'Transporte atualizado com sucesso!');
    }

    public function destroy(Transporte $transporte): RedirectResponse
    {
        $transporte->delete();

        return redirect()->route('administracao.transporte.listar')
            ->with('success', 'Transporte excluído com sucesso!');
    }
}
