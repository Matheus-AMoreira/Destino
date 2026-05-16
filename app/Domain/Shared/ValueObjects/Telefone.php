<?php

namespace App\Domain\Shared\ValueObjects;

use InvalidArgumentException;

final readonly class Telefone
{
    public string $value;

    public function __construct(string $value)
    {
        $digits = preg_replace('/\D/', '', $value);

        $len = strlen($digits);

        // Aceita celular (11 dígitos) ou fixo (10 dígitos)
        if ($len < 10 || $len > 11) {
            throw new InvalidArgumentException("Telefone inválido: {$value}");
        }

        $this->value = $digits;
    }

    public function isCelular(): bool
    {
        return strlen($this->value) === 11;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
