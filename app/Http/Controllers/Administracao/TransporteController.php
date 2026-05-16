<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Hospedagem\TransporteService;
use Illuminate\Routing\Controller;
use App\Http\Requests\Administracao\StoreTransporteRequest;
use App\Http\Requests\Administracao\UpdateTransporteRequest;
use App\Domain\Hospedagem\Enums\Meio;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransporteController extends Controller
{
    public function __construct(
        private readonly TransporteService $transporteService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Administracao/Transporte/Index', [
            'transportes' => $this->transporteService->listarTodos(),
            'meios' => array_column(Meio::cases(), 'value'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Transporte/Create', [
            'meios' => array_column(Meio::cases(), 'value'),
        ]);
    }

    public function store(StoreTransporteRequest $request): RedirectResponse
    {
        $this->transporteService->criar($request->validated());
        return redirect()->route('administracao.transporte.index')->with('success', 'Transporte criado com sucesso.');
    }

    public function edit(int $id): Response
    {
        $transporte = $this->transporteService->buscarPorId($id);
        if (!$transporte) abort(404);

        return Inertia::render('Administracao/Transporte/Edit', [
            'transporte' => $transporte,
            'meios' => array_column(Meio::cases(), 'value'),
        ]);
    }

    public function update(UpdateTransporteRequest $request, int $id): RedirectResponse
    {
        $this->transporteService->atualizar($id, $request->validated());
        return redirect()->route('administracao.transporte.index')->with('success', 'Transporte atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->transporteService->deletar($id);
        return redirect()->route('administracao.transporte.index')->with('success', 'Transporte deletado com sucesso.');
    }
}
