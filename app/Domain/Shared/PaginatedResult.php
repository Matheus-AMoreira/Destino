<?php

namespace App\Domain\Shared;

readonly class PaginatedResult
{
    public function __construct(
        public array $items,
        public int $total,
        public int $page,
        public int $perPage,
    ) {}

    public function lastPage(): int
    {
        return max(1, (int) ceil($this->total / $this->perPage));
    }

    public function currentPage(): int
    {
        return $this->page;
    }
}
