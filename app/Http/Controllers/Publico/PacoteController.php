<?php

namespace App\Http\Controllers\Publico;

use App\Application\Catalogo\PacoteService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PacoteController extends Controller
{
    public function __construct(
        private readonly PacoteService $pacoteService,
    ) {}

    public function detalhes(string $nome): Response
    {
        // Decode URI component if needed
        $nomeDecoded = urldecode($nome);
        $dto = $this->pacoteService->detalhes($nomeDecoded);

        if (!$dto) {
            abort(404, 'Pacote não encontrado.');
        }

        return Inertia::render('Pacote/Detalhes', [
            'pacote' => $dto,
        ]);
    }
}
