<?php

namespace App\Http\Controllers\Publico;

use App\Application\Catalogo\PacoteService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly PacoteService $pacoteService,
    ) {}

    public function index(Request $request): Response
    {
        $page = $request->integer('page', 1);
        $result = $this->pacoteService->listarCards($page, 12);

        return Inertia::render('Index', [
            'pacotes' => $result->items,
            'totalPaginas' => $result->lastPage(),
            'paginaAtual' => $result->page - 1, // Inertia component expects 0-indexed for some reason or 1-indexed? keeping original logic if needed, but standard is 1. We will pass 1-indexed.
            'currentPage' => $result->page,
        ]);
    }

    public function contato(): Response
    {
        return Inertia::render('Contato');
    }
}
