<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administracao\StoreHotelRequest;
use App\Http\Requests\Administracao\UpdateHotelRequest;
use App\Models\Cidade;
use App\Models\Estado;
use App\Models\Hotel;
use App\Models\Regiao;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HotelController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/Hotel/Index', [
            'hotels' => Hotel::with('cidade.estado.regiao')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Hotel/Create', [
            'regioes' => Regiao::all(),
            'estados' => Estado::all(),
            'cidades' => Cidade::all(),
        ]);
    }

    public function store(StoreHotelRequest $request): RedirectResponse
    {
        Hotel::create($request->validated());

        return redirect()->route('administracao.hotel.listar')
            ->with('success', 'Hotel criado com sucesso!');
    }

    public function edit(Hotel $hotel): Response
    {
        return Inertia::render('Administracao/Hotel/Edit', [
            'hotel' => $hotel->load('cidade.estado.regiao'),
            'regioes' => Regiao::all(),
            'estados' => Estado::all(),
            'cidades' => Cidade::all(),
        ]);
    }

    public function update(UpdateHotelRequest $request, Hotel $hotel): RedirectResponse
    {
        $hotel->update($request->validated());

        return redirect()->route('administracao.hotel.listar')
            ->with('success', 'Hotel atualizado com sucesso!');
    }

    public function destroy(Hotel $hotel): RedirectResponse
    {
        $hotel->delete();

        return redirect()->route('administracao.hotel.listar')
            ->with('success', 'Hotel excluído com sucesso!');
    }
}
