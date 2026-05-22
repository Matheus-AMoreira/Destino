<?php

declare(strict_types=1);

namespace App\Domain\Avaliacao\Entities;

final class Avaliacao
{
    private int $id;
    private int $nota;
    private ?string $comentario;
    private \DateTimeImmutable $criadoEm;

    public function __construct(int $id, int $nota, ?string $comentario, \DateTimeImmutable $criadoEm)
    {
        $this->id = $id;
        $this->nota = $nota;
        $this->comentario = $comentario;
        $this->criadoEm = $criadoEm;
    }

    public function getId(): int
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

    public function getCriadoEm(): \DateTimeImmutable
    {
        return $this->criadoEm;
    }
}
