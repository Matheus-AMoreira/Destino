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
        $id = DB::table('avaliacoes')->insertGetId([
            'nota' => $dados['nota'],
            'comentario' => $dados['comentario'] ?? null,
            'user_id' => $dados['user_id'],
            'pacote_id' => $dados['pacote_id'],
            'compra_id' => $dados['compra_id'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->atualizarCachePacote($dados['pacote_id']);

        return $id;
    }

    public function buscarPorId(int $id): ?Avaliacao
    {
        $row = DB::table('avaliacoes')->where('id', $id)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function atualizar(int $id, array $dados): bool
    {
        $avaliacao = $this->buscarPorId($id);
        if (!$avaliacao) {
            return false;
        }

        $dados['updated_at'] = now();
        $updated = DB::table('avaliacoes')->where('id', $id)->update($dados) > 0;

        if ($updated) {
            $this->atualizarCachePacote($avaliacao->pacoteId);
        }

        return $updated;
    }

    public function deletar(int $id): bool
    {
        $avaliacao = $this->buscarPorId($id);
        if (!$avaliacao) {
            return false;
        }

        $deleted = DB::table('avaliacoes')->where('id', $id)->delete() > 0;

        if ($deleted) {
            $this->atualizarCachePacote($avaliacao->pacoteId);
        }

        return $deleted;
    }

    public function listarPorPacote(int $pacoteId): array
    {
        $rows = DB::table('avaliacoes as a1')
            ->join('users as u', 'a1.user_id', '=', 'u.id')
            ->where('a1.pacote_id', $pacoteId)
            ->whereRaw('a1.id = (
                SELECT MAX(a2.id)
                FROM avaliacoes as a2
                WHERE a2.user_id = a1.user_id
                  AND a2.pacote_id = a1.pacote_id
            )')
            ->orderBy('a1.created_at', 'desc')
            ->select(
                'a1.*',
                DB::raw("CONCAT(u.nome, ' ', u.sobre_nome) as nome_usuario")
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

    public function jaAvaliadaPorCompra(string $compraId): bool
    {
        return DB::table('avaliacoes')
            ->where('compra_id', $compraId)
            ->exists();
    }

    public function buscarPorCompra(string $compraId): ?Avaliacao
    {
        $row = DB::table('avaliacoes')->where('compra_id', $compraId)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function calcularMedia(int $pacoteId): ?float
    {
        // Calcular a média considerando apenas as últimas avaliações de cada usuário
        $subquery = DB::table('avaliacoes as a2')
            ->where('a2.pacote_id', $pacoteId)
            ->whereRaw('a2.id = (
                SELECT MAX(a3.id)
                FROM avaliacoes as a3
                WHERE a3.user_id = a2.user_id
                  AND a3.pacote_id = a2.pacote_id
            )');

        $result = DB::table(DB::raw("({$subquery->toSql()}) as filtered"))
            ->mergeBindings($subquery)
            ->avg('nota');

        return $result ? round($result, 2) : null;
    }

    public function contarAvaliacoes(int $pacoteId): int
    {
        // Contar apenas as últimas avaliações de cada usuário
        $subquery = DB::table('avaliacoes as a2')
            ->where('a2.pacote_id', $pacoteId)
            ->whereRaw('a2.id = (
                SELECT MAX(a3.id)
                FROM avaliacoes as a3
                WHERE a3.user_id = a2.user_id
                  AND a3.pacote_id = a2.pacote_id
            )');

        return DB::table(DB::raw("({$subquery->toSql()}) as filtered"))
            ->mergeBindings($subquery)
            ->count();
    }

    public function obterAvaliacoesPacote(int $pacoteId): AvaliacaoPacoteDTO
    {
        $pacote = DB::table('pacotes')->where('id', $pacoteId)->first();
        $notaMedia = $pacote ? (float) ($pacote->media_avaliacao ?? 0) : 0;
        $quantidade = $pacote ? (int) $pacote->total_avaliacoes : 0;
        $avaliacoes = $this->listarPorPacote($pacoteId);

        return new AvaliacaoPacoteDTO(
            notaMedia: $notaMedia,
            quantidadeAvaliacoes: $quantidade,
            avaliacoes: $avaliacoes,
        );
    }

    private function atualizarCachePacote(int $pacoteId): void
    {
        $notaMedia = $this->calcularMedia($pacoteId);
        $quantidade = $this->contarAvaliacoes($pacoteId);

        DB::table('pacotes')
            ->where('id', $pacoteId)
            ->update([
                'media_avaliacao' => $notaMedia,
                'total_avaliacoes' => $quantidade,
            ]);
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
