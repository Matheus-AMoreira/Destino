<?php

namespace App\ViewModels\Catalogo;

use Illuminate\Contracts\Support\Arrayable;
use App\Models\Catalogo\Pacote;
use Illuminate\Support\Facades\Storage;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PacoteCardViewModel implements Arrayable
{
    public readonly int $id;
    public readonly string $nome;
    public readonly string $descricao;

    /** @var array{foto_capa_url: ?string}|null */
    public readonly ?array $fotos_do_pacote;

    /** @var array<array{id: int, nome: string}> */
    public readonly array $tags;

    public readonly int $active_ofertas_count;
    public readonly ?float $media_avaliacao;
    public readonly int $total_avaliacoes;

    /** @var array{preco: float, inicio: string, fim: string}|null */
    public readonly ?array $cheapest_active_offer;

    public function __construct(
        Pacote $pacote,
        int $ofertasAtivas,
        ?object $cheapestOffer
    ) {
        $foto = $pacote->album;
        $fotoCapa = null;
        if ($foto) {
            $fotoCapa = $foto->is_url
                ? $foto->foto_capa
                : ($foto->foto_capa ? Storage::url($foto->foto_capa) : null);
        }

        $this->id = $pacote->id;
        $this->nome = $pacote->nome;
        $this->descricao = $pacote->descricao;
        $this->fotos_do_pacote = $fotoCapa ? ['foto_capa_url' => $fotoCapa] : null;
        $this->tags = $pacote->tags->map(fn($t) => [
            'id' => $t->id,
            'nome' => $t->nome
        ])->toArray();
        $this->active_ofertas_count = $ofertasAtivas;
        $this->media_avaliacao = $pacote->media_avaliacao;
        $this->total_avaliacoes = $pacote->total_avaliacoes ?? 0;
        $this->cheapest_active_offer = $cheapestOffer ? [
            'preco' => (float) $cheapestOffer->preco,
            'inicio' => $cheapestOffer->inicio,
            'fim' => $cheapestOffer->fim,
        ] : null;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'fotos_do_pacote' => $this->fotos_do_pacote,
            'tags' => $this->tags,
            'active_ofertas_count' => $this->active_ofertas_count,
            'media_avaliacao' => $this->media_avaliacao,
            'total_avaliacoes' => $this->total_avaliacoes,
            'cheapest_active_offer' => $this->cheapest_active_offer,
        ];
    }
}
