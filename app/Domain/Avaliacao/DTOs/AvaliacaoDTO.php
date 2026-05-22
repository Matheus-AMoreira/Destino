<?php

namespace App\Domain\Avaliacao\DTOs;

class AvaliacaoDTO
{
    private ?int $id;
    private int $nota;
    private ?string $comentario;
    private ?string $dataAvaliacao;
    private ?int $usuarioId;
    private ?int $destinoId;

    public function __construct(
        ?int $id,
        int $nota,
        ?string $comentario,
        ?string $dataAvaliacao,
        ?int $usuarioId,
        ?int $destinoId
    ) {
        $this->id = $id;
        $this->nota = $nota;
        $this->comentario = $comentario;
        $this->dataAvaliacao = $dataAvaliacao;
        $this->usuarioId = $usuarioId;
        $this->destinoId = $destinoId;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNota(): int
    {
        return $this->nota;
    }

    public function getComentario(): ?string
    {
        return $this->comentario;
    }

    public function getDataAvaliacao(): ?string
    {
        return $this->dataAvaliacao;
    }

    public function getUsuarioId(): ?int
    {
        return $this->usuarioId;
    }

    public function getDestinoId(): ?int
    {
        return $this->destinoId;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['id'] ?? null,
            $data['nota'] ?? 0,
            $data['comentario'] ?? null,
            $data['data_avaliacao'] ?? null,
            $data['usuario_id'] ?? null,
            $data['destino_id'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nota' => $this->nota,
            'comentario' => $this->comentario,
            'data_avaliacao' => $this->dataAvaliacao,
            'usuario_id' => $this->usuarioId,
            'destino_id' => $this->destinoId,
        ];
    }
}
