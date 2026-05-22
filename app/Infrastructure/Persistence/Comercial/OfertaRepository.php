<?php

namespace App\Infrastructure\Persistence\Comercial;

use App\Domain\Comercial\Entities\Oferta;
use App\Domain\Comercial\Repositories\OfertaRepositoryInterface;
use App\Domain\Comercial\Enums\OfertaStatus;
use Illuminate\Support\Facades\DB;

class OfertaRepository implements OfertaRepositoryInterface
{
    public function buscarPorId(int $id): ?Oferta
    {
        $row = DB::table('ofertas')->where('id', $id)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function listarAdmin(): array
    {
        return DB::table('ofertas')
            ->leftJoin('pacotes', 'ofertas.pacote_id', '=', 'pacotes.id')
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('transportes', 'ofertas.transporte_id', '=', 'transportes.id')
            ->select(
                'ofertas.*',
                'pacotes.nome as pacote_nome',
                'hotels.nome as hotel_nome',
                'transportes.empresa as transporte_empresa',
                'transportes.meio as transporte_meio',
            )
            ->latest('ofertas.created_at')
            ->get()
            ->all();
    }

    public function criar(array $dados): int
    {
        $isAvailable = ($dados['disponibilidade'] ?? 0) > 0;

        return DB::table('ofertas')->insertGetId([
            'preco' => $dados['preco'],
            'inicio' => $dados['inicio'],
            'fim' => $dados['fim'],
            'disponibilidade' => $dados['disponibilidade'],
            'status' => $dados['status'] ?? OfertaStatus::EMANDAMENTO->value,
            'is_available' => $isAvailable,
            'pacote_id' => $dados['pacote_id'],
            'hotel_id' => $dados['hotel_id'],
            'transporte_id' => $dados['transporte_id'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function atualizar(int $id, array $dados): bool
    {
        if (isset($dados['disponibilidade'])) {
            $dados['is_available'] = $dados['disponibilidade'] > 0;
        }
        $dados['updated_at'] = now();

        return DB::table('ofertas')->where('id', $id)->update($dados) > 0;
    }

    public function deletar(int $id): bool
    {
        return DB::table('ofertas')->where('id', $id)->delete() > 0;
    }

    public function contar(): int
    {
        return DB::table('ofertas')->count();
    }

    public function buscarDetalhesCheckout(int $ofertaId): ?object
    {
        return DB::table('ofertas')
            ->where('ofertas.id', $ofertaId)
            ->where('ofertas.is_available', true)
            ->leftJoin('pacotes', 'ofertas.pacote_id', '=', 'pacotes.id')
            ->leftJoin('pacote_fotos', 'pacotes.pacote_foto_id', '=', 'pacote_fotos.id')
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->select(
                'ofertas.*',
                'pacotes.nome as pacote_nome',
                'pacote_fotos.foto_capa as pf_foto_capa',
                'pacote_fotos.is_url as pf_is_url',
                'hotels.nome as hotel_nome',
                'cidades.nome as cidade_nome',
                'estados.sigla as estado_sigla'
            )
            ->first();
    }

    private function hydrate(object $row): Oferta
    {
        return new Oferta(
            id: $row->id,
            preco: (float) $row->preco,
            inicio: $row->inicio,
            fim: $row->fim,
            disponibilidade: $row->disponibilidade,
            status: OfertaStatus::from($row->status),
            isAvailable: (bool) $row->is_available,
            pacoteId: $row->pacote_id,
            hotelId: $row->hotel_id,
            transporteId: $row->transporte_id,
            createdAt: $row->created_at,
            updatedAt: $row->updated_at,
        );
    }
}
