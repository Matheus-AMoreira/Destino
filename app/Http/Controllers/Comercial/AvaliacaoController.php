<?php

namespace App\Http\Controllers\Comercial;

use App\Http\Requests\Comercial\StoreAvaliacaoRequest;
use App\Http\Requests\Comercial\UpdateAvaliacaoRequest;
use App\Repositories\Comercial\AvaliacaoRepository;
use App\Actions\Comercial\SalvarAvaliacaoAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use InvalidArgumentException;

class AvaliacaoController extends Controller
{
    public function __construct(
        private readonly AvaliacaoRepository $avaliacaoRepository,
        private readonly SalvarAvaliacaoAction $salvarAction,
    ) {}

    public function store(StoreAvaliacaoRequest $request): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $compraId = (string) $request->input('compra_id');
            $pacoteId = (int) $request->input('pacote_id');
            $nota = (int) $request->input('nota');
            $comentario = $request->input('comentario');

            // Validar permissão de avaliação
            $permitido = $this->avaliacaoRepository->verificarPermissaoAvaliacao($userId, $compraId);
            if (!$permitido) {
                throw new InvalidArgumentException("Você não tem permissão para avaliar esta viagem ou ela já foi avaliada.");
            }

            if ($nota < 1 || $nota > 5) {
                throw new InvalidArgumentException("A nota deve estar entre 1 e 5.");
            }
            if ($comentario && strlen($comentario) > 500) {
                throw new InvalidArgumentException("O comentário não pode ultrapassar 500 caracteres.");
            }

            $this->salvarAction->execute($userId, $compraId, $pacoteId, $nota, $comentario);

            $avaliacoesData = $this->avaliacaoRepository->obterAvaliacoesPacoteData($pacoteId);

            return response()->json([
                'message' => 'Avaliação criada com sucesso.',
                'data' => $avaliacoesData,
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function show(int $pacoteId): JsonResponse
    {
        try {
            $avaliacoes = $this->avaliacaoRepository->obterAvaliacoesPacoteData($pacoteId);
            return response()->json($avaliacoes);
        } catch (InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function update(UpdateAvaliacaoRequest $request, int $id): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $nota = (int) $request->input('nota');
            $comentario = $request->input('comentario');

            $avaliacao = $this->avaliacaoRepository->buscarPorId($id);
            if (!$avaliacao || $avaliacao->user_id !== $userId) {
                throw new InvalidArgumentException("Você não tem permissão para atualizar esta avaliação.");
            }

            if ($request->has('nota')) {
                if ($nota < 1 || $nota > 5) {
                    throw new InvalidArgumentException("A nota deve estar entre 1 e 5.");
                }
            }

            if ($request->has('comentario')) {
                if ($comentario && strlen($comentario) > 500) {
                    throw new InvalidArgumentException("O comentário não pode ultrapassar 500 caracteres.");
                }
            }

            // Executa o salvar/atualizar
            $this->salvarAction->execute($userId, $avaliacao->compra_id, $avaliacao->pacote_id, $nota, $comentario);

            return response()->json(['message' => 'Avaliação atualizada com sucesso.']);
        } catch (InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $avaliacao = $this->avaliacaoRepository->buscarPorId($id);
            if (!$avaliacao || $avaliacao->user_id !== $userId) {
                throw new InvalidArgumentException("Você não tem permissão para deletar esta avaliação.");
            }

            $avaliacao->delete();
            return response()->json(['message' => 'Avaliação deletada com sucesso.'], 204);
        } catch (InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function verificarPermissao(Request $request, string $compraId): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $permitido = $this->avaliacaoRepository->verificarPermissaoAvaliacao($userId, $compraId);

            return response()->json(['permitido' => $permitido]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
