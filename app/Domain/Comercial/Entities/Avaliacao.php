<?php

declare(strict_types=1);

namespace App\Domain\Comercial\Entities;

use DateTimeImmutable;

final class Avaliacao
{
    private int $id;
    private int $nota;
    private ?string $comentario;
    private DateTimeImmutable $criadoEm;

    public function __construct(int $id, int $nota, ?string $comentario, DateTimeImmutable $criadoEm)
    {
        $this->id = $id;
        $this->nota = $nota;
        $this->comentario = $comentario;
        $this->criadoEm = $criadoEm;
    }
}
