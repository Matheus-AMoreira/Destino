<?php

namespace App\Repositories\Comercial;

use App\Models\Comercial\Avaliacao;
use App\Models\Comercial\Compra;
use App\Models\Comercial\Oferta;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AvaliacaoRepository
{
    public function buscarPorId(int $id): ?Avaliacao
    {
        return Avaliacao::find($id);
    }

    public function jaAvaliada(string $compraId): bool
    {
        return Avaliacao::where('compra_id', $compraId)->exists();
    }

    public function verificarPermissaoAvaliacao(string $userId, string $compraId): bool
    {
        $compra = Compra::find($compraId);
        if (!$compra || $compra->user_id !== $userId) {
            return false;
        }

        $oferta = Oferta::find($compra->oferta_id);
        if (!$oferta || Carbon::parse($oferta->fim)->endOfDay()->isFuture()) {
            return false;
        }

        // Só pode ter uma avaliação por usuário por pacote
        $jaAvaliouPacote = Avaliacao::where('user_id', $userId)
            ->where('pacote_id', $oferta->pacote_id)
            ->where('compra_id', '!=', $compraId)
            ->exists();
        if ($jaAvaliouPacote) {
            return false;
        }

        return !$this->jaAvaliada($compraId);
    }

    public function obterAvaliacoesPacoteData(int $pacoteId): array
    {
        // Encontrar a última oferta do pacote que possui avaliações
        $ultimaOfertaId = Oferta::where('pacote_id', $pacoteId)
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('compras')
                    ->join('avaliacoes', 'compras.id', '=', 'avaliacoes.compra_id')
                    ->whereColumn('compras.oferta_id', 'ofertas.id');
            })
            ->orderByDesc('inicio')
            ->orderByDesc('id')
            ->value('id');

        $query = Avaliacao::with('usuario')
            ->where('pacote_id', $pacoteId);

        if ($ultimaOfertaId) {
            $query->whereHas('compra', function ($q) use ($ultimaOfertaId) {
                $q->where('oferta_id', $ultimaOfertaId);
            });
        } else {
            $query->whereRaw('1 = 0');
        }

        $avaliacoes = $query->get();

        $notaMedia = $avaliacoes->avg('nota') ?? 0.0;
        $quantidadeAvaliacoes = $avaliacoes->count();

        $avaliacoesDTO = $avaliacoes->map(fn($av) => new \App\DTOs\Comercial\AvaliacaoDTO(
            id: $av->id,
            nota: $av->nota,
            comentario: $av->comentario,
            user_id: $av->user_id,
            nomeUsuario: $av->usuario?->nome ?? 'Usuário',
            pacote_id: $av->pacote_id,
            created_at: $av->created_at ? $av->created_at->toISOString() : null,
        ))->toArray();

        return (new \App\DTOs\Comercial\AvaliacaoPacoteDTO(
            notaMedia: (float) round($notaMedia, 1),
            quantidadeAvaliacoes: $quantidadeAvaliacoes,
            avaliacoes: $avaliacoesDTO
        ))->jsonSerialize();
    }
}

