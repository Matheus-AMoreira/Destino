<?php

namespace App\Http\Controllers\Catalogo;

use App\Models\Catalogo\Pacote;
use App\Repositories\Catalogo\PacoteRepository;
use App\ViewModels\Catalogo\PacoteCardViewModel as AppPacoteCardViewModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PublicoBuscaController extends Controller
{
    public function __construct(
        private readonly PacoteRepository $pacoteRepository,
    ) {}

    public function buscar(Request $request): Response
    {
        $termo = $request->input('termo') ?? '';
        $precoMax = $request->integer('precoMax', 0);
        $page = $request->integer('page', 1);
        $page = $page > 0 ? $page : 1;
        $perPage = $request->integer('size', 12);

        $result = $this->pacoteRepository->buscarPacotesFiltradosPaginado($termo, $precoMax, $page, $perPage);

        $cards = $result['items']->map(function(Pacote $p) use ($result) {
            $viewModel = new AppPacoteCardViewModel(
                $p,
                $result['activeCounts'][$p->id] ?? 0,
                $result['cheapestOffers'][$p->id] ?? null
            );
            return $viewModel->toArray();
        })->toArray();

        $lastPage = (int) ceil($result['total'] / $perPage);

        return Inertia::render('Buscar', [
            'pacotes' => $cards,
            'filters' => [
                'termo' => $termo,
                'precoMax' => $precoMax,
                'page' => $page,
                'size' => $perPage,
            ],
            'paginacao' => [
                'page' => $page,
                'totalPages' => $lastPage,
                'totalElements' => $result['total'],
            ],
        ]);
    }
}
