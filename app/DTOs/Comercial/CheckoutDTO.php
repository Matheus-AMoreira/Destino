<?php

namespace App\DTOs\Comercial;

use JsonSerializable;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class CheckoutDTO implements JsonSerializable
{
    public int $id;
    public float $preco;
    public string $inicio;
    public string $fim;
    public int $disponibilidade;
    
    /** @var array{nome: string, fotos_do_pacote: ?array{foto_capa_url: string}}|null */
    public ?array $pacote;
    
    /** @var array{nome: string, cidade: array{nome: string, estado: array{sigla: string}}}|null */
    public ?array $hotel;

    public function __construct(
        int $ofertaId,
        float $preco,
        string $inicio,
        string $fim,
        int $disponibilidade,
        ?string $pacoteNome,
        ?string $fotoCapa,
        ?string $hotelNome,
        ?string $cidadeNome,
        ?string $estadoSigla,
    ) {
        $this->id = $ofertaId;
        $this->preco = $preco;
        $this->inicio = $inicio;
        $this->fim = $fim;
        $this->disponibilidade = $disponibilidade;
        
        $this->pacote = $pacoteNome ? [
            'nome' => $pacoteNome,
            'fotos_do_pacote' => $fotoCapa ? ['foto_capa_url' => $fotoCapa] : null,
        ] : null;
        
        $this->hotel = $hotelNome ? [
            'nome' => $hotelNome,
            'cidade' => [
                'nome' => $cidadeNome,
                'estado' => ['sigla' => $estadoSigla],
            ],
        ] : null;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'preco' => $this->preco,
            'inicio' => $this->inicio,
            'fim' => $this->fim,
            'disponibilidade' => $this->disponibilidade,
            'pacote' => $this->pacote,
            'hotel' => $this->hotel,
        ];
    }
}
