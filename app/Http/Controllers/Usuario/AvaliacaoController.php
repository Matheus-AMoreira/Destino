<?php

namespace App\Http\Controllers\Usuario;

use App\Application\Comercial\AvaliacaoService;
use App\Http\Requests\Usuario\StoreAvaliacaoRequest;
use App\Http\Requests\Usuario\UpdateAvaliacaoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AvaliacaoController extends Controller
{
    public function __construct(
        private readonly AvaliacaoService $avaliacaoService,
    ) {}

    public function store(StoreAvaliacaoRequest $request): JsonResponse
    {
        try {
            $avaliacaoId = $this->avaliacaoService->criar(
                userId: $request->user()->id,
                pacoteId: (int) $request->input('pacote_id'),
                compraId: (string) $request->input('compra_id'),
                nota: (int) $request->input('nota'),
                comentario: $request->input('comentario'),
            );

            $avaliacao = $this->avaliacaoService->obterAvaliacoesPacote((int) $request->input('pacote_id'));

            return response()->json([
                'message' => 'Avaliação criada com sucesso.',
                'data' => $avaliacao,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function show(int $pacoteId): JsonResponse
    {
        try {
            $avaliacoes = $this->avaliacaoService->obterAvaliacoesPacote($pacoteId);
            return response()->json($avaliacoes);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function update(UpdateAvaliacaoRequest $request, int $id): JsonResponse
    {
        try {
            $this->avaliacaoService->atualizar(
                avaliacaoId: $id,
                userId: $request->user()->id,
                nota: (int) $request->input('nota'),
                comentario: $request->input('comentario'),
            );

            return response()->json(['message' => 'Avaliação atualizada com sucesso.']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->avaliacaoService->deletar($id, $request->user()->id);
            return response()->json(['message' => 'Avaliação deletada com sucesso.'], 204);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function verificarPermissao(Request $request, string $compraId): JsonResponse
    {
        try {
            $permitido = $this->avaliacaoService->verificarPermissaoAvaliacao(
                $request->user()->id,
                $compraId,
            );

            return response()->json(['permitido' => $permitido]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
