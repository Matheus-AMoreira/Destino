<?php

namespace App\Domain\Catalogo\DTOs;

/**
 * DTO de saída para listagem admin de pacotes.
 */
readonly class PacoteAdminDTO implements \JsonSerializable
{
    public function __construct(
        public int $id,
        public string $nome,
        public string $descricao,
        public ?string $funcionarioNome,
        public ?string $fotoCapa,
        public ?string $createdAt,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'funcionario' => $this->funcionarioNome ? ['nome' => $this->funcionarioNome] : null,
            'fotos_do_pacote' => $this->fotoCapa ? ['foto_capa_url' => $this->fotoCapa] : null,
            'created_at' => $this->createdAt,
        ];
    }
}
