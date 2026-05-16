<?php

namespace App\Domain\Identidade\Entities;

readonly class Permission
{
    public function __construct(
        public int $id,
        public string $slug,
        public ?string $description = null,
        public bool $isStaff = false,
    ) {}
}
