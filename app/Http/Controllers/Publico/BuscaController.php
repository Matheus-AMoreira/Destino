<?php

namespace App\Http\Controllers\Publico;

use App\Application\Catalogo\PacoteService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BuscaController extends Controller
{
    public function __construct(
        private readonly PacoteService $pacoteService,
    ) {}

    public function buscar(Request $request): Response
    {
        $termo = $request->input('termo') ?? '';
        $precoMax = $request->integer('precoMax', 0);
        $page = $request->integer('page', 0);
        $perPage = $request->integer('size', 12);

        $result = $this->pacoteService->buscar($termo, $precoMax, $page, $perPage);

        return Inertia::render('Buscar', [
            'pacotes' => $result->items,
            'filters' => [
                'termo' => $termo,
                'precoMax' => $precoMax,
                'page' => $page,
                'size' => $perPage,
            ],
            'paginacao' => [
                'page' => $result->page,
                'totalPages' => $result->lastPage(),
                'totalElements' => $result->total,
            ],
        ]);
    }
}
