<?php

namespace App\Http\Controllers\Hospedagem;

use App\Models\Hospedagem\Hotel;
use App\Models\Geografia\Regiao;
use App\Models\Geografia\Estado;
use App\Models\Geografia\Cidade;
use App\Http\Requests\Hospedagem\StoreHotelRequest;
use App\Http\Requests\Hospedagem\UpdateHotelRequest;
use App\Repositories\Hospedagem\HotelRepository;
use App\Actions\Hospedagem\CriarHotelAction;
use App\Actions\Hospedagem\AtualizarHotelAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminHotelController extends Controller
{
    public function __construct(
        private readonly HotelRepository $hotelRepository,
        private readonly CriarHotelAction $criarAction,
        private readonly AtualizarHotelAction $atualizarAction,
    ) {}

    public function index(Request $request): Response
    {
        $termo = $request->input('q', '');
        $hotels = $this->hotelRepository->obterTodosParaAdmin($termo);

        return Inertia::render('Administracao/Hotel/Index', [
            'hotels' => $hotels,
            'filters' => [
                'termo' => $termo,
            ],
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
        $this->criarAction->execute($request->validated());

        return redirect()->route('administracao.hotel.index')->with('success', 'Hotel criado com sucesso.');
    }

    public function edit(int $id): Response
    {
        $hotel = $this->hotelRepository->buscarPorId($id);
        if (!$hotel) {
            abort(404);
        }

        $hotelData = [
            'id' => $hotel->id,
            'nome' => $hotel->nome,
            'endereco' => $hotel->endereco,
            'diaria' => $hotel->diaria,
            'cidade_id' => $hotel->cidade_id,
            'cep' => $hotel->cep,
            'cep_data' => is_string($hotel->cep_data) ? json_decode($hotel->cep_data, true) : $hotel->cep_data,
        ];

        return Inertia::render('Administracao/Hotel/Edit', [
            'hotel' => $hotelData,
            'regioes' => Regiao::all(),
            'estados' => Estado::all(),
            'cidades' => Cidade::all(),
        ]);
    }

    public function update(UpdateHotelRequest $request, int $id): RedirectResponse
    {
        $hotel = $this->hotelRepository->buscarPorId($id);
        if (!$hotel) {
            abort(404);
        }

        $this->atualizarAction->execute($hotel, $request->validated());

        return redirect()->route('administracao.hotel.index')->with('success', 'Hotel atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $hotel = $this->hotelRepository->buscarPorId($id);
        if ($hotel) {
            $hotel->delete();
        }

        return redirect()->route('administracao.hotel.index')->with('success', 'Hotel deletado com sucesso.');
    }
}
