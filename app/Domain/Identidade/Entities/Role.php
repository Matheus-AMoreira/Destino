<?php

namespace App\Domain\Identidade\Entities;

readonly class Role
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $description = null,
        public bool $isStaff = false,
    ) {}
}
