<?php

namespace App\Http\Controllers\Hospedagem;

use App\Models\Hospedagem\Transporte;
use App\Enums\Hospedagem\Meio;
use App\Http\Requests\Hospedagem\StoreTransporteRequest;
use App\Http\Requests\Hospedagem\UpdateTransporteRequest;
use App\Repositories\Hospedagem\TransporteRepository;
use App\Actions\Hospedagem\CriarTransporteAction;
use App\Actions\Hospedagem\AtualizarTransporteAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AdminTransporteController extends Controller
{
    public function __construct(
        private readonly TransporteRepository $transporteRepository,
        private readonly CriarTransporteAction $criarAction,
        private readonly AtualizarTransporteAction $atualizarAction,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Administracao/Transporte/Index', [
            'transportes' => $this->transporteRepository->obterTodos(),
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
        $this->criarAction->execute($request->validated());

        return redirect()->route('administracao.transporte.index')->with('success', 'Transporte criado com sucesso.');
    }

    public function edit(int $id): Response
    {
        $transporte = $this->transporteRepository->buscarPorId($id);
        if (!$transporte) {
            abort(404);
        }

        return Inertia::render('Administracao/Transporte/Edit', [
            'transporte' => $transporte,
            'meios' => array_column(Meio::cases(), 'value'),
        ]);
    }

    public function update(UpdateTransporteRequest $request, int $id): RedirectResponse
    {
        $transporte = $this->transporteRepository->buscarPorId($id);
        if (!$transporte) {
            abort(404);
        }

        $this->atualizarAction->execute($transporte, $request->validated());

        return redirect()->route('administracao.transporte.index')->with('success', 'Transporte atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $transporte = $this->transporteRepository->buscarPorId($id);
        if ($transporte) {
            $transporte->delete();
        }

        return redirect()->route('administracao.transporte.index')->with('success', 'Transporte deletado com sucesso.');
    }
}
