<?php

namespace App\Http\Controllers\Catalogo;

use App\Repositories\Catalogo\PacoteRepository;
use App\ViewModels\Catalogo\PacoteDetalhesViewModel as AppPacoteDetalhesViewModel;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PublicoPacoteController extends Controller
{
    public function __construct(
        private readonly PacoteRepository $pacoteRepository,
    ) {}

    public function detalhes(string $nome): Response
    {
        $nomeDecoded = urldecode($nome);

        $pacote = $this->pacoteRepository->buscarPorNome($nomeDecoded);

        if (!$pacote) {
            abort(404, 'Pacote não encontrado.');
        }

        $ofertas = $this->pacoteRepository->obterOfertasAtivasDoPacote($pacote->id);

        $viewModel = new AppPacoteDetalhesViewModel($pacote, $ofertas);

        return Inertia::render('Pacote/Detalhes', [
            'pacote' => $viewModel->toArray(),
        ]);
    }
}
