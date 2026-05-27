<?php

namespace App\Infrastructure\Persistence\Comercial;

use App\Domain\Comercial\Entities\Avaliacao;
use App\Domain\Comercial\Repositories\AvaliacaoRepositoryInterface;
use App\Domain\Comercial\DTOs\AvaliacaoDTO;
use App\Domain\Comercial\DTOs\AvaliacaoPacoteDTO;
use Illuminate\Support\Facades\DB;

class AvaliacaoRepository implements AvaliacaoRepositoryInterface
{
    public function criar(array $dados): int
    {
        return DB::table('avaliacoes')->insertGetId([
            'nota' => $dados['nota'],
            'comentario' => $dados['comentario'] ?? null,
            'user_id' => $dados['user_id'],
            'pacote_id' => $dados['pacote_id'],
            'compra_id' => $dados['compra_id'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function buscarPorId(int $id): ?Avaliacao
    {
        $row = DB::table('avaliacoes')->where('id', $id)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function atualizar(int $id, array $dados): bool
    {
        $dados['updated_at'] = now();
        return DB::table('avaliacoes')->where('id', $id)->update($dados) > 0;
    }

    public function deletar(int $id): bool
    {
        return DB::table('avaliacoes')->where('id', $id)->delete() > 0;
    }

    public function listarPorPacote(int $pacoteId): array
    {
        $rows = DB::table('avaliacoes')
            ->join('users', 'avaliacoes.user_id', '=', 'users.id')
            ->where('avaliacoes.pacote_id', $pacoteId)
            ->orderBy('avaliacoes.created_at', 'desc')
            ->select(
                'avaliacoes.*',
                DB::raw("CONCAT(users.nome, ' ', users.sobre_nome) as nome_usuario")
            )
            ->get();

        return $rows->map(fn($row) => $this->hydrateDtoFromRow($row))->toArray();
    }

    public function listarPorUsuario(string $userId): array
    {
        $rows = DB::table('avaliacoes')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $rows->map(fn($row) => $this->hydrate($row))->toArray();
    }

    public function jaAvaliadaPorUsuario(string $userId, int $pacoteId): bool
    {
        return DB::table('avaliacoes')
            ->where('user_id', $userId)
            ->where('pacote_id', $pacoteId)
            ->exists();
    }

    public function calcularMedia(int $pacoteId): ?float
    {
        $result = DB::table('avaliacoes')
            ->where('pacote_id', $pacoteId)
            ->avg('nota');

        return $result ? round($result, 2) : null;
    }

    public function contarAvaliacoes(int $pacoteId): int
    {
        return DB::table('avaliacoes')
            ->where('pacote_id', $pacoteId)
            ->count();
    }

    public function obterAvaliacoesPacote(int $pacoteId): AvaliacaoPacoteDTO
    {
        $notaMedia = $this->calcularMedia($pacoteId) ?? 0;
        $quantidade = $this->contarAvaliacoes($pacoteId);
        $avaliacoes = $this->listarPorPacote($pacoteId);

        return new AvaliacaoPacoteDTO(
            notaMedia: $notaMedia,
            quantidadeAvaliacoes: $quantidade,
            avaliacoes: $avaliacoes,
        );
    }

    private function hydrate(object $row): Avaliacao
    {
        return new Avaliacao(
            id: (int) $row->id,
            nota: (int) $row->nota,
            comentario: $row->comentario,
            userId: $row->user_id,
            pacoteId: (int) $row->pacote_id,
            compraId: $row->compra_id,
            createdAt: $row->created_at,
            updatedAt: $row->updated_at,
        );
    }

    private function hydrateDtoFromRow(object $row): AvaliacaoDTO
    {
        return AvaliacaoDTO::fromRow(
            row: $row,
            nomeUsuario: $row->nome_usuario,
        );
    }
}
