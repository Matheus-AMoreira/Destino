<?php

namespace App\Domain\Shared\ValueObjects;

use InvalidArgumentException;

final readonly class Cpf
{
    public string $value;

    public function __construct(string $value)
    {
        $digits = preg_replace('/\D/', '', $value);

        if (!$this->isValid($digits)) {
            throw new InvalidArgumentException("CPF inválido: {$value}");
        }

        $this->value = $digits;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function isValid(string $digits): bool
    {
        if (strlen($digits) !== 11) {
            return false;
        }

        // Rejeita sequências repetidas (ex.: 111.111.111-11)
        if (preg_match('/^(\d)\1{10}$/', $digits)) {
            return false;
        }

        // Valida os dois dígitos verificadores
        for ($t = 9; $t <= 10; $t++) {
            $sum = 0;
            for ($i = 0; $i < $t; $i++) {
                $sum += (int) $digits[$i] * ($t + 1 - $i);
            }
            $remainder = (10 * $sum) % 11;
            if ((int) $digits[$t] !== ($remainder === 10 ? 0 : $remainder)) {
                return false;
            }
        }

        return true;
    }
}
