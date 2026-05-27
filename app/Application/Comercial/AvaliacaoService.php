<?php

namespace App\Application\Comercial;

use App\Domain\Comercial\Repositories\AvaliacaoRepositoryInterface;
use App\Domain\Comercial\Repositories\CompraRepositoryInterface;
use App\Domain\Comercial\Repositories\OfertaRepositoryInterface;
use App\Domain\Comercial\DTOs\AvaliacaoDTO;
use App\Domain\Comercial\DTOs\AvaliacaoPacoteDTO;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class AvaliacaoService
{
    public function __construct(
        private readonly AvaliacaoRepositoryInterface $avaliacaoRepo,
        private readonly CompraRepositoryInterface $compraRepo,
        private readonly OfertaRepositoryInterface $ofertaRepo,
    ) {}

    public function criar(string $userId, int $pacoteId, string $compraId, int $nota, ?string $comentario): int
    {
        // Validar que a compra existe e pertence ao usuário
        $compra = $this->compraRepo->buscarPorId($compraId);
        if (!$compra || $compra->userId !== $userId) {
            throw new InvalidArgumentException("Compra não encontrada.");
        }

        // Validar que a oferta terminou
        $oferta = $this->ofertaRepo->buscarPorId($compra->ofertaId);
        if (!$oferta || $oferta->fim > now()) {
            throw new InvalidArgumentException("Você só pode avaliar após o término da viagem.");
        }

        // Validar que o usuário ainda não avaliou este pacote
        if ($this->avaliacaoRepo->jaAvaliadaPorUsuario($userId, $pacoteId)) {
            throw new InvalidArgumentException("Você já avaliou este pacote.");
        }

        // Validar nota
        if ($nota < 1 || $nota > 5) {
            throw new InvalidArgumentException("A nota deve estar entre 1 e 5.");
        }

        // Validar comentário
        if ($comentario && strlen($comentario) > 500) {
            throw new InvalidArgumentException("O comentário não pode ultrapassar 500 caracteres.");
        }

        return $this->avaliacaoRepo->criar([
            'nota' => $nota,
            'comentario' => $comentario,
            'user_id' => $userId,
            'pacote_id' => $pacoteId,
            'compra_id' => $compraId,
        ]);
    }

    public function atualizar(int $avaliacaoId, string $userId, int $nota, ?string $comentario): bool
    {
        // Validar autorização
        $avaliacao = $this->avaliacaoRepo->buscarPorId($avaliacaoId);
        if (!$avaliacao || $avaliacao->userId !== $userId) {
            throw new InvalidArgumentException("Você não tem permissão para atualizar esta avaliação.");
        }

        // Validar nota
        if ($nota < 1 || $nota > 5) {
            throw new InvalidArgumentException("A nota deve estar entre 1 e 5.");
        }

        // Validar comentário
        if ($comentario && strlen($comentario) > 500) {
            throw new InvalidArgumentException("O comentário não pode ultrapassar 500 caracteres.");
        }

        return $this->avaliacaoRepo->atualizar($avaliacaoId, [
            'nota' => $nota,
            'comentario' => $comentario,
        ]);
    }

    public function deletar(int $avaliacaoId, string $userId): bool
    {
        // Validar autorização
        $avaliacao = $this->avaliacaoRepo->buscarPorId($avaliacaoId);
        if (!$avaliacao || $avaliacao->userId !== $userId) {
            throw new InvalidArgumentException("Você não tem permissão para deletar esta avaliação.");
        }

        return $this->avaliacaoRepo->deletar($avaliacaoId);
    }

    public function obterAvaliacoesPacote(int $pacoteId): AvaliacaoPacoteDTO
    {
        return $this->avaliacaoRepo->obterAvaliacoesPacote($pacoteId);
    }

    public function verificarPermissaoAvaliacao(string $userId, string $compraId): bool
    {
        $compra = $this->compraRepo->buscarPorId($compraId);
        if (!$compra || $compra->userId !== $userId) {
            return false;
        }

        $oferta = $this->ofertaRepo->buscarPorId($compra->ofertaId);
        if (!$oferta || $oferta->fim > now()) {
            return false;
        }

        return !$this->avaliacaoRepo->jaAvaliadaPorUsuario($userId, $oferta->pacoteId);
    }
}
