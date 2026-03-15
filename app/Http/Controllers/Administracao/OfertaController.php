<?php

namespace App\Http\Controllers\Administracao;

use App\Enums\OfertaStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Administracao\StoreOfertaRequest;
use App\Http\Requests\Administracao\UpdateOfertaRequest;
use App\Models\Hotel;
use App\Models\Oferta;
use App\Models\Pacote;
use App\Models\Transporte;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OfertaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/Oferta/Index', [
            'ofertas' => Oferta::with(['pacote', 'hotel', 'transporte'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Oferta/Create', [
            'pacotes' => Pacote::all(),
            'hoteis' => Hotel::all(),
            'transportes' => Transporte::all(),
            'statuses' => OfertaStatus::cases(),
        ]);
    }

    public function store(StoreOfertaRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = OfertaStatus::EMANDAMENTO;

        Oferta::create($data);

        return redirect()->route('administracao.oferta.listar')
            ->with('success', 'Oferta criada com sucesso!');
    }

    public function edit(Oferta $oferta): Response
    {
        return Inertia::render('Administracao/Oferta/Edit', [
            'oferta' => $oferta,
            'pacotes' => Pacote::all(),
            'hoteis' => Hotel::all(),
            'transportes' => Transporte::all(),
            'statuses' => OfertaStatus::cases(),
        ]);
    }

    public function update(UpdateOfertaRequest $request, Oferta $oferta): RedirectResponse
    {
        $oferta->update($request->validated());

        return redirect()->route('administracao.oferta.listar')
            ->with('success', 'Oferta atualizada com sucesso!');
    }

    public function destroy(Oferta $oferta): RedirectResponse
    {
        $oferta->delete();

        return redirect()->route('administracao.oferta.listar')
            ->with('success', 'Oferta excluída com sucesso!');
    }
}
