<?php

namespace App\Domain\Catalogo\DTOs;

use App\Domain\Comercial\DTOs\OfertaDTO;
use Illuminate\Support\Facades\Storage;

/**
 * DTO de saída para a página de detalhes do pacote.
 */
readonly class PacoteDetalhesDTO implements \JsonSerializable
{
    /**
     * @param array $tags
     * @param OfertaDTO[] $ofertas
     * @param array $fotos
     */
    public function __construct(
        public int $id,
        public string $nome,
        public string $descricao,
        public ?string $fotoCapa,
        public array $tags,
        public array $ofertas,
        public array $fotos,
        public int $ofertasAtivas,
        public ?float $menorPreco,
        public ?float $mediaAvaliacao = null,
        public int $totalAvaliacoes = 0,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'fotos_do_pacote' => $this->fotoCapa ? [
                'foto_capa_url' => $this->fotoCapa,
                'fotos' => $this->fotos,
            ] : null,
            'tags' => $this->tags,
            'ofertas' => $this->ofertas,
            'active_ofertas_count' => $this->ofertasAtivas,
            'media_avaliacao' => $this->mediaAvaliacao,
            'total_avaliacoes' => $this->totalAvaliacoes,
            'cheapest_active_offer' => $this->menorPreco !== null ? [
                'preco' => $this->menorPreco,
            ] : null,
        ];
    }
}
