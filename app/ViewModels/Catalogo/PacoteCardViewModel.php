<?php

namespace App\ViewModels\Catalogo;

use Illuminate\Contracts\Support\Arrayable;
use App\Models\Catalogo\Pacote;
use Illuminate\Support\Facades\Storage;

class PacoteCardViewModel implements Arrayable
{
    public function __construct(
        private readonly Pacote $pacote,
        private readonly int $ofertasAtivas,
        private readonly ?object $cheapestOffer
    ) {}

    public function toArray(): array
    {
        $foto = $this->pacote->album;
        $fotoCapa = null;
        if ($foto) {
            $fotoCapa = $foto->is_url
                ? $foto->foto_capa
                : ($foto->foto_capa ? Storage::url($foto->foto_capa) : null);
        }

        return [
            'id' => $this->pacote->id,
            'nome' => $this->pacote->nome,
            'descricao' => $this->pacote->descricao,
            'fotos_do_pacote' => $fotoCapa ? ['foto_capa_url' => $fotoCapa] : null,
            'tags' => $this->pacote->tags->map(fn($t) => [
                'id' => $t->id,
                'nome' => $t->nome
            ])->toArray(),
            'active_ofertas_count' => $this->ofertasAtivas,
            'media_avaliacao' => $this->pacote->media_avaliacao,
            'total_avaliacoes' => $this->pacote->total_avaliacoes ?? 0,
            'cheapest_active_offer' => $this->cheapestOffer ? [
                'preco' => (float) $this->cheapestOffer->preco,
                'inicio' => $this->cheapestOffer->inicio,
                'fim' => $this->cheapestOffer->fim,
            ] : null,
        ];
    }
}
