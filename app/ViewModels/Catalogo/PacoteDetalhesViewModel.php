<?php

namespace App\ViewModels\Catalogo;

use Illuminate\Contracts\Support\Arrayable;
use App\Models\Catalogo\Pacote;
use Illuminate\Support\Facades\Storage;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PacoteDetalhesViewModel implements Arrayable
{
    public readonly int $id;
    public readonly string $nome;
    public readonly string $descricao;

    /**
     * @var array{
     *   foto_capa_url: string,
     *   fotos: array<array{id: int, caminho_url: string, is_url: bool, ordem: int}>
     * }|null
     */
    public readonly ?array $fotos_do_pacote;

    /** @var array<array{id: int, nome: string}> */
    public readonly array $tags;

    /** @var array */
    public readonly array $ofertas;

    public readonly int $active_ofertas_count;
    public readonly ?float $media_avaliacao;
    public readonly int $total_avaliacoes;

    /** @var array{preco: float}|null */
    public readonly ?array $cheapest_active_offer;

    /**
     * @var array{
     *   id: int,
     *   preco: float,
     *   inicio: string,
     *   fim: string,
     *   disponibilidade: int,
     *   status: string,
     *   isAvailable: bool,
     *   hotel: array{id: int, nome: string, endereco: string, diaria: int, cidade: array{id: int, nome: string, estado: array{id: int, nome: string, sigla: string}}}|null,
     *   transporte: array{id: int, empresa: string, meio: string, preco: int}|null
     * }|null
     */
    public readonly ?array $latest_offer;

    public function __construct(
        Pacote $pacote,
        array $ofertas
    ) {
        $album = $pacote->album;
        $fotoCapa = null;
        $fotos = [];

        if ($album) {
            $fotoCapa = $album->is_url
                ? $album->foto_capa
                : ($album->foto_capa ? Storage::url($album->foto_capa) : null);

            $fotos = $album->items->map(fn($item) => [
                'id' => $item->id,
                'caminho_url' => $item->is_url ? $item->caminho : Storage::url($item->caminho),
                'is_url' => (bool) $item->is_url,
                'ordem' => (int) $item->ordem,
            ])->toArray();
        }

        $menorPreco = !empty($ofertas)
            ? min(array_map(fn($o) => (float) $o['preco'], $ofertas))
            : null;

        $latestOfferRecord = \Illuminate\Support\Facades\DB::table('ofertas')
            ->where('pacote_id', $pacote->id)
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('transportes', 'ofertas.transporte_id', '=', 'transportes.id')
            ->select(
                'ofertas.*',
                'hotels.nome as hotel_nome',
                'hotels.endereco as hotel_endereco',
                'hotels.diaria as hotel_diaria',
                'cidades.id as cidade_id',
                'cidades.nome as cidade_nome',
                'estados.id as estado_id',
                'estados.nome as estado_nome',
                'estados.sigla as estado_sigla',
                'transportes.empresa as transporte_empresa',
                'transportes.meio as transporte_meio',
                'transportes.preco as transporte_preco'
            )
            ->orderByDesc('ofertas.fim')
            ->first();

        $latestOffer = $latestOfferRecord ? [
            'id' => $latestOfferRecord->id,
            'preco' => (float) $latestOfferRecord->preco,
            'inicio' => $latestOfferRecord->inicio,
            'fim' => $latestOfferRecord->fim,
            'disponibilidade' => $latestOfferRecord->disponibilidade,
            'status' => $latestOfferRecord->status,
            'isAvailable' => (bool) $latestOfferRecord->is_available,
            'hotel' => $latestOfferRecord->hotel_id ? [
                'id' => $latestOfferRecord->hotel_id,
                'nome' => $latestOfferRecord->hotel_nome,
                'endereco' => $latestOfferRecord->hotel_endereco,
                'diaria' => (int) $latestOfferRecord->hotel_diaria,
                'cidade' => [
                    'id' => $latestOfferRecord->cidade_id,
                    'nome' => $latestOfferRecord->cidade_nome,
                    'estado' => ['id' => $latestOfferRecord->estado_id, 'nome' => $latestOfferRecord->estado_nome, 'sigla' => $latestOfferRecord->estado_sigla],
                ],
            ] : null,
            'transporte' => $latestOfferRecord->transporte_id ? [
                'id' => $latestOfferRecord->transporte_id,
                'empresa' => $latestOfferRecord->transporte_empresa,
                'meio' => $latestOfferRecord->transporte_meio,
                'preco' => (int) $latestOfferRecord->transporte_preco,
            ] : null,
        ] : null;

        $this->id = $pacote->id;
        $this->nome = $pacote->nome;
        $this->descricao = $pacote->descricao;
        $this->fotos_do_pacote = $fotoCapa ? [
            'foto_capa_url' => $fotoCapa,
            'fotos' => $fotos,
        ] : null;
        $this->tags = $pacote->tags->map(fn($t) => [
            'id' => $t->id,
            'nome' => $t->nome
        ])->toArray();
        $this->ofertas = $ofertas;
        $this->active_ofertas_count = count($ofertas);
        $this->media_avaliacao = $pacote->media_avaliacao;
        $this->total_avaliacoes = $pacote->total_avaliacoes ?? 0;
        $this->cheapest_active_offer = $menorPreco !== null ? [
            'preco' => $menorPreco,
        ] : null;
        $this->latest_offer = $latestOffer;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'fotos_do_pacote' => $this->fotos_do_pacote,
            'tags' => $this->tags,
            'ofertas' => $this->ofertas,
            'active_ofertas_count' => $this->active_ofertas_count,
            'media_avaliacao' => $this->media_avaliacao,
            'total_avaliacoes' => $this->total_avaliacoes,
            'cheapest_active_offer' => $this->cheapest_active_offer,
            'latest_offer' => $this->latest_offer,
        ];
    }
}
