<?php

namespace App\ViewModels\Catalogo;

use Illuminate\Contracts\Support\Arrayable;
use App\Models\Catalogo\Pacote;
use Illuminate\Support\Facades\Storage;

class PacoteDetalhesViewModel implements Arrayable
{
    public function __construct(
        private readonly Pacote $pacote,
        private readonly array $ofertas
    ) {}

    public function toArray(): array
    {
        $album = $this->pacote->album;
        $fotoCapa = null;
        $fotos = [];

        if ($album) {
            $fotoCapa = $album->is_url
                ? $album->foto_capa
                : ($album->foto_capa ? Storage::url($album->foto_capa) : null);

            $fotos = $album->items->map(fn($item) => [
                'id' => $item->id,
                'caminho_url' => $item->is_url ? $item->caminho : Storage::url($item->caminho),
                'is_url' => $item->is_url,
                'ordem' => $item->ordem,
            ])->toArray();
        }

        $menorPreco = !empty($this->ofertas)
            ? min(array_map(fn($o) => (float) $o['preco'], $this->ofertas))
            : null;

        return [
            'id' => $this->pacote->id,
            'nome' => $this->pacote->nome,
            'descricao' => $this->pacote->descricao,
            'fotos_do_pacote' => $fotoCapa ? [
                'foto_capa_url' => $fotoCapa,
                'fotos' => $fotos,
            ] : null,
            'tags' => $this->pacote->tags->map(fn($t) => [
                'id' => $t->id,
                'nome' => $t->nome
            ])->toArray(),
            'ofertas' => $this->ofertas,
            'active_ofertas_count' => count($this->ofertas),
            'media_avaliacao' => $this->pacote->media_avaliacao,
            'total_avaliacoes' => $this->pacote->total_avaliacoes ?? 0,
            'cheapest_active_offer' => $menorPreco !== null ? [
                'preco' => $menorPreco,
            ] : null,
        ];
    }
}
