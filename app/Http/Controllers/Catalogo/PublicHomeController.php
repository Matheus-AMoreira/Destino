<?php

namespace App\Http\Controllers\Catalogo;

use App\Models\Catalogo\Pacote;
use App\Repositories\Catalogo\PacoteRepository;
use App\ViewModels\Catalogo\PacoteCardViewModel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PublicHomeController extends Controller
{
    public function __construct(
        private readonly PacoteRepository $pacoteRepository,
    ) {}

    public function index(Request $request): Response
    {
        $page = $request->integer('page', 1);
        $perPage = 12;

        $result = $this->pacoteRepository->obterPacotesComOfertasPaginado($page, $perPage);

        $cards = $result['items']->map(function(Pacote $p) use ($result) {
            $viewModel = new PacoteCardViewModel(
                $p,
                $result['activeCounts'][$p->id] ?? 0,
                $result['cheapestOffers'][$p->id] ?? null
            );
            return $viewModel->toArray();
        })->toArray();

        $lastPage = (int) ceil($result['total'] / $perPage);

        return Inertia::render('Index', [
            'pacotes' => $cards,
            'totalPaginas' => $lastPage,
            'paginaAtual' => $page - 1,
            'currentPage' => $page,
        ]);
    }

    public function contato(): Response
    {
        return Inertia::render('Contato');
    }
}
