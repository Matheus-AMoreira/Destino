<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Comercial\OfertaService;
use App\Application\Catalogo\PacoteService;
use App\Application\Hospedagem\HotelService;
use App\Application\Hospedagem\TransporteService;
use App\Domain\Comercial\Enums\OfertaStatus;
use Illuminate\Routing\Controller;
use App\Http\Requests\Administracao\StoreOfertaRequest;
use App\Http\Requests\Administracao\UpdateOfertaRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OfertaController extends Controller
{
    public function __construct(
        private readonly OfertaService $ofertaService,
        private readonly PacoteService $pacoteService,
        private readonly HotelService $hotelService,
        private readonly TransporteService $transporteService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Administracao/Oferta/Index', [
            'ofertas' => $this->ofertaService->listarAdmin(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Oferta/Create', [
            'pacotes' => $this->pacoteService->listarAdmin(),
            'hoteis' => $this->hotelService->listarComLocalizacao(),
            'transportes' => $this->transporteService->listarTodos(),
            'statuses' => array_map(fn($s) => ['name' => $s->name, 'value' => $s->value], OfertaStatus::cases()),
        ]);
    }

    public function store(StoreOfertaRequest $request): RedirectResponse
    {
        $this->ofertaService->criar($request->validated());
        return redirect()->route('administracao.oferta.index')->with('success', 'Oferta criada com sucesso.');
    }

    public function edit(int $id): Response
    {
        $oferta = $this->ofertaService->buscarPorId($id);
        if (!$oferta) abort(404);

        return Inertia::render('Administracao/Oferta/Edit', [
            'oferta' => $oferta,
            'pacotes' => $this->pacoteService->listarAdmin(),
            'hoteis' => $this->hotelService->listarComLocalizacao(),
            'transportes' => $this->transporteService->listarTodos(),
            'statuses' => array_map(fn($s) => ['name' => $s->name, 'value' => $s->value], OfertaStatus::cases()),
        ]);
    }

    public function update(UpdateOfertaRequest $request, int $id): RedirectResponse
    {
        $this->ofertaService->atualizar($id, $request->validated());
        return redirect()->route('administracao.oferta.index')->with('success', 'Oferta atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->ofertaService->deletar($id);
        return redirect()->route('administracao.oferta.index')->with('success', 'Oferta deletada com sucesso.');
    }
}
