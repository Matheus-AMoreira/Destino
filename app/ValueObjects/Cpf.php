<?php

namespace App\ValueObjects;

use InvalidArgumentException;

final readonly class Cpf
{
    public string $value;

    public function __construct(string $value)
    {
        $digits = preg_replace('/\D/', '', $value);

        if (strlen($digits) !== 11) {
            throw new InvalidArgumentException("CPF deve conter exatamente 11 dígitos.");
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

    public function formatted(): string
    {
        return vsprintf('%s%s%s.%s%s%s.%s%s%s-%s%s', str_split($this->value));
    }

    public function masked(): string
    {
        return substr($this->value, 0, 3) . '.***.***-' . substr($this->value, -2);
    }
}
