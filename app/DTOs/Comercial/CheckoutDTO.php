<?php

namespace App\DTOs\Comercial;

use JsonSerializable;

readonly class CheckoutDTO implements JsonSerializable
{
    public function __construct(
        public int $ofertaId,
        public float $preco,
        public string $inicio,
        public string $fim,
        public int $disponibilidade,
        public ?string $pacoteNome,
        public ?string $fotoCapa,
        public ?string $hotelNome,
        public ?string $cidadeNome,
        public ?string $estadoSigla,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->ofertaId,
            'preco' => $this->preco,
            'inicio' => $this->inicio,
            'fim' => $this->fim,
            'disponibilidade' => $this->disponibilidade,
            'pacote' => $this->pacoteNome ? [
                'nome' => $this->pacoteNome,
                'fotos_do_pacote' => $this->fotoCapa ? ['foto_capa_url' => $this->fotoCapa] : null,
            ] : null,
            'hotel' => $this->hotelNome ? [
                'nome' => $this->hotelNome,
                'cidade' => [
                    'nome' => $this->cidadeNome,
                    'estado' => ['sigla' => $this->estadoSigla],
                ],
            ] : null,
        ];
    }
}
