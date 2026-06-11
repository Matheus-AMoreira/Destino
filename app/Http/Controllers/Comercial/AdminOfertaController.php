<?php

namespace App\Http\Controllers\Comercial;

use App\Enums\Comercial\OfertaStatus;
use App\Http\Requests\Comercial\StoreOfertaRequest;
use App\Http\Requests\Comercial\UpdateOfertaRequest;
use App\Repositories\Comercial\OfertaRepository;
use App\Repositories\Catalogo\PacoteRepository;
use App\Repositories\Hospedagem\HotelRepository;
use App\Repositories\Hospedagem\TransporteRepository;
use App\Actions\Comercial\CriarOfertaAction;
use App\Actions\Comercial\AtualizarOfertaAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AdminOfertaController extends Controller
{
    public function __construct(
        private readonly OfertaRepository $ofertaRepository,
        private readonly PacoteRepository $pacoteRepository,
        private readonly HotelRepository $hotelRepository,
        private readonly TransporteRepository $transporteRepository,
        private readonly CriarOfertaAction $criarAction,
        private readonly AtualizarOfertaAction $atualizarAction,
    ) {}

    public function index(): Response
    {
        $ofertas = $this->ofertaRepository->obterTodasParaAdmin();

        return Inertia::render('Administracao/Oferta/Index', [
            'ofertas' => $ofertas,
        ]);
    }

    public function create(): Response
    {
        $pacotes = $this->pacoteRepository->obterTodosParaAdmin();
        $hoteis = $this->hotelRepository->obterTodosParaAdmin();
        $transportes = $this->transporteRepository->obterTodos();
        $statuses = array_map(fn($s) => ['name' => $s->name, 'value' => $s->value], OfertaStatus::cases());

        return Inertia::render('Administracao/Oferta/Create', [
            'pacotes' => $pacotes,
            'hoteis' => $hoteis,
            'transportes' => $transportes,
            'statuses' => $statuses,
        ]);
    }

    public function store(StoreOfertaRequest $request): RedirectResponse
    {
        $dados = $request->validated();
        if (!isset($dados['status'])) {
            $dados['status'] = OfertaStatus::EMANDAMENTO->value;
        }

        $this->criarAction->execute($dados);

        return redirect()->route('administracao.oferta.index')->with('success', 'Oferta criada com sucesso.');
    }

    public function edit(int $id): Response
    {
        $oferta = $this->ofertaRepository->buscarPorId($id);
        if (!$oferta) {
            abort(404);
        }

        $pacotes = $this->pacoteRepository->obterTodosParaAdmin();
        $hoteis = $this->hotelRepository->obterTodosParaAdmin();
        $transportes = $this->transporteRepository->obterTodos();
        $statuses = array_map(fn($s) => ['name' => $s->name, 'value' => $s->value], OfertaStatus::cases());

        $ofertaData = [
            'id' => $oferta->id,
            'preco' => (float) $oferta->preco,
            'inicio' => $oferta->inicio,
            'fim' => $oferta->fim,
            'disponibilidade' => $oferta->disponibilidade,
            'status' => $oferta->status,
            'pacote_id' => $oferta->pacote_id,
            'hotel_id' => $oferta->hotel_id,
            'transporte_id' => $oferta->transporte_id,
        ];

        return Inertia::render('Administracao/Oferta/Edit', [
            'oferta' => $ofertaData,
            'pacotes' => $pacotes,
            'hoteis' => $hoteis,
            'transportes' => $transportes,
            'statuses' => $statuses,
        ]);
    }

    public function update(UpdateOfertaRequest $request, int $id): RedirectResponse
    {
        $oferta = $this->ofertaRepository->buscarPorId($id);
        if (!$oferta) {
            abort(404);
        }

        $this->atualizarAction->execute($oferta, $request->validated());

        return redirect()->route('administracao.oferta.index')->with('success', 'Oferta atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $oferta = $this->ofertaRepository->buscarPorId($id);
        if ($oferta) {
            $oferta->delete();
        }

        return redirect()->route('administracao.oferta.index')->with('success', 'Oferta deletada com sucesso.');
    }
}
