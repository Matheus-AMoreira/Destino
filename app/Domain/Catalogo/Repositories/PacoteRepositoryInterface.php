<?php

namespace App\Domain\Catalogo\Repositories;

use App\Domain\Catalogo\Entities\Pacote;
use App\Domain\Catalogo\Entities\PacoteFoto;
use App\Domain\Catalogo\Entities\FotoItem;
use App\Domain\Catalogo\Entities\Tag;
use App\Domain\Shared\PaginatedResult;

interface PacoteRepositoryInterface
{
    // === Pacotes ===
    public function paginar(int $perPage = 12, int $page = 1): PaginatedResult;
    public function buscar(string $termo, int $precoMax, int $perPage = 12, int $page = 1): PaginatedResult;
    public function buscarPorNome(string $nome): ?Pacote;
    public function buscarPorId(int $id): ?Pacote;
    public function listarAdmin(): array;
    public function criar(array $dados): int;
    public function atualizar(int $id, array $dados): bool;
    public function deletar(int $id): bool;
    public function contar(): int;

    // === Tags ===
    /** @return Tag[] */
    public function listarTags(): array;
    public function buscarOuCriarTag(string $nome): int;
    public function sincronizarTags(int $pacoteId, array $tagIds): void;
    /** @return Tag[] */
    public function buscarTagsDoPacote(int $pacoteId): array;

    // === Fotos ===
    /** @return PacoteFoto[] */
    public function listarAlbuns(): array;
    public function buscarAlbumPorId(int $id): ?PacoteFoto;
    public function criarAlbum(array $dados): int;
    public function atualizarAlbum(int $id, array $dados): bool;
    public function deletarAlbum(int $id): bool;
    /** @return FotoItem[] */
    public function buscarFotosDoAlbum(int $albumId): array;
    public function criarFotoItem(array $dados): int;
    public function atualizarFotoItem(int $id, array $dados): bool;
    public function deletarFotoItem(int $id): bool;
    public function buscarFotoItemPorId(int $id): ?FotoItem;
    public function contarFotosDoAlbum(int $albumId): int;

    // === Queries Complexas (Card) ===
    /** @return array{tags: array, fotos: array, ofertas_count: array, cheapest: array, latest: array} */
    public function carregarRelacoesDePacotes(array $pacoteIds): array;

    // === Detalhes Completo ===
    public function carregarOfertasDisponiveisDoPacote(int $pacoteId): array;
}
