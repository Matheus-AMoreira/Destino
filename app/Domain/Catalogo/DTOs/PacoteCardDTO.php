<?php

namespace App\Domain\Catalogo\DTOs;

use App\Domain\Catalogo\Entities\PacoteFoto;
use App\Domain\Catalogo\Entities\Tag;
use Illuminate\Support\Facades\Storage;

/**
 * DTO de saída para cards de pacotes (home e busca).
 * Controla exatamente o que o frontend recebe.
 */
readonly class PacoteCardDTO implements \JsonSerializable
{
    /**
     * @param Tag[] $tags
     */
    public function __construct(
        public int $id,
        public string $nome,
        public string $descricao,
        public ?string $fotoCapa,
        public array $tags,
        public int $ofertasAtivas,
        public ?float $menorPreco,
        public ?string $dataInicio,
        public ?string $dataFim,
        public ?float $mediaAvaliacao,
        public int $totalAvaliacoes,
    ) {}

    public static function fromRow(
        object $pacote,
        ?PacoteFoto $foto,
        array $tags,
        int $ofertasAtivas,
        ?object $cheapestOffer,
    ): self {
        $fotoCapa = null;
        if ($foto) {
            $fotoCapa = $foto->isUrl
                ? $foto->fotoCapa
                : ($foto->fotoCapa ? Storage::url($foto->fotoCapa) : null);
        }

        return new self(
            id: $pacote->id,
            nome: $pacote->nome,
            descricao: $pacote->descricao,
            fotoCapa: $fotoCapa,
            tags: array_map(fn(Tag $t) => ['id' => $t->id, 'nome' => $t->nome], $tags),
            ofertasAtivas: $ofertasAtivas,
            menorPreco: $cheapestOffer ? (float) $cheapestOffer->preco : null,
            dataInicio: $cheapestOffer->inicio ?? null,
            dataFim: $cheapestOffer->fim ?? null,
            mediaAvaliacao: isset($pacote->media_avaliacao) ? (float) $pacote->media_avaliacao : null,
            totalAvaliacoes: isset($pacote->total_avaliacoes) ? (int) $pacote->total_avaliacoes : 0,
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'fotos_do_pacote' => $this->fotoCapa ? ['foto_capa_url' => $this->fotoCapa] : null,
            'tags' => $this->tags,
            'active_ofertas_count' => $this->ofertasAtivas,
            'media_avaliacao' => $this->mediaAvaliacao,
            'total_avaliacoes' => $this->totalAvaliacoes,
            'cheapest_active_offer' => $this->menorPreco !== null ? [
                'preco' => $this->menorPreco,
                'inicio' => $this->dataInicio,
                'fim' => $this->dataFim,
            ] : null,
        ];
    }
}
