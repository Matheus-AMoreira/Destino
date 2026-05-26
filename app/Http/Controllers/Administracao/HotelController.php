<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Hospedagem\HotelService;
use App\Application\Geografia\LocalizacaoService;
use Illuminate\Routing\Controller;
use App\Http\Requests\Administracao\StoreHotelRequest;
use App\Http\Requests\Administracao\UpdateHotelRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HotelController extends Controller
{
    public function __construct(
        private readonly HotelService $hotelService,
        private readonly LocalizacaoService $locService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Administracao/Hotel/Index', [
            'hotels' => $this->hotelService->listarComLocalizacao(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Hotel/Create', [
            'regioes' => $this->locService->listarRegioes(),
            'estados' => $this->locService->listarEstados(),
            'cidades' => $this->locService->listarCidades(),
        ]);
    }

    public function store(StoreHotelRequest $request): RedirectResponse
    {
        $this->hotelService->criar($request->validated());
        return redirect()->route('administracao.hotel.index')->with('success', 'Hotel criado com sucesso.');
    }

    public function edit(int $id): Response
    {
        $hotel = $this->hotelService->buscarDTO($id);
        if (!$hotel) abort(404);

        return Inertia::render('Administracao/Hotel/Edit', [
            'hotel' => $hotel,
            'regioes' => $this->locService->listarRegioes(),
            'estados' => $this->locService->listarEstados(),
            'cidades' => $this->locService->listarCidades(),
        ]);
    }

    public function update(UpdateHotelRequest $request, int $id): RedirectResponse
    {
        $this->hotelService->atualizar($id, $request->validated());
        return redirect()->route('administracao.hotel.index')->with('success', 'Hotel atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->hotelService->deletar($id);
        return redirect()->route('administracao.hotel.index')->with('success', 'Hotel deletado com sucesso.');
    }
}
