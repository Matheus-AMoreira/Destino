<?php

namespace App\Application\Catalogo;

use App\Application\Shared\ActivityLogService;
use App\Domain\Catalogo\DTOs\PacoteAdminDTO;
use App\Domain\Catalogo\DTOs\PacoteCardDTO;
use App\Domain\Catalogo\DTOs\PacoteDetalhesDTO;
use App\Domain\Catalogo\Repositories\PacoteRepositoryInterface;
use App\Domain\Comercial\DTOs\OfertaDTO;
use App\Domain\Shared\PaginatedResult;
use App\Domain\Comercial\Enums\OfertaStatus;
use Illuminate\Support\Facades\Storage;

class PacoteService
{
    public function __construct(
        private readonly PacoteRepositoryInterface $repo,
        private readonly ActivityLogService $log,
    ) {}

    public function listarCards(int $page, int $perPage = 12): PaginatedResult
    {
        $result = $this->repo->paginar($perPage, $page);
        $pacoteIds = array_map(fn($p) => $p->id, $result->items);
        $rel = $this->repo->carregarRelacoesDePacotes($pacoteIds);

        $cards = array_map(fn($p) => PacoteCardDTO::fromRow(
            pacote: $p,
            foto: $rel['fotos'][$p->id] ?? null,
            tags: $rel['tags'][$p->id] ?? [],
            ofertasAtivas: $rel['ofertas_count'][$p->id] ?? 0,
            cheapestOffer: $rel['cheapest'][$p->id] ?? null,
        ), $result->items);

        return new PaginatedResult($cards, $result->total, $result->page, $result->perPage);
    }

    public function buscar(string $termo, int $precoMax, int $page, int $perPage = 12): PaginatedResult
    {
        $result = $this->repo->buscar($termo, $precoMax, $perPage, $page);
        $pacoteIds = array_map(fn($p) => $p->id, $result->items);
        $rel = $this->repo->carregarRelacoesDePacotes($pacoteIds);

        $cards = array_map(fn($p) => PacoteCardDTO::fromRow(
            pacote: $p,
            foto: $rel['fotos'][$p->id] ?? null,
            tags: $rel['tags'][$p->id] ?? [],
            ofertasAtivas: $rel['ofertas_count'][$p->id] ?? 0,
            cheapestOffer: $rel['cheapest'][$p->id] ?? null,
        ), $result->items);

        return new PaginatedResult($cards, $result->total, $result->page, $result->perPage);
    }

    public function detalhes(string $nome): ?PacoteDetalhesDTO
    {
        $pacote = $this->repo->buscarPorNome($nome);
        if (!$pacote) return null;

        $rel = $this->repo->carregarRelacoesDePacotes([$pacote->id]);
        $foto = $rel['fotos'][$pacote->id] ?? null;
        $tags = $rel['tags'][$pacote->id] ?? [];
        $ofertas = $this->repo->carregarOfertasDisponiveisDoPacote($pacote->id);

        $fotoCapa = null;
        if ($foto) {
            $fotoCapa = $foto->isUrl ? $foto->fotoCapa : ($foto->fotoCapa ? Storage::url($foto->fotoCapa) : null);
        }

        $fotos = [];
        if ($foto) {
            $fotoItems = $this->repo->buscarFotosDoAlbum($foto->id);
            $fotos = array_map(fn($f) => [
                'id' => $f->id,
                'caminho_url' => $f->isUrl ? $f->caminho : Storage::url($f->caminho),
                'is_url' => $f->isUrl,
                'ordem' => $f->ordem,
            ], $fotoItems);
        }

        $ofertaDTOs = array_map(fn($o) => new OfertaDTO(
            id: $o->id,
            preco: (float) $o->preco,
            inicio: $o->inicio,
            fim: $o->fim,
            disponibilidade: $o->disponibilidade,
            status: OfertaStatus::from($o->status),
            isAvailable: (bool) $o->is_available,
            hotel: $o->hotel_id ? [
                'id' => $o->hotel_id,
                'nome' => $o->hotel_nome,
                'endereco' => $o->hotel_endereco,
                'diaria' => (int) $o->hotel_diaria,
                'cidade' => [
                    'id' => $o->cidade_id,
                    'nome' => $o->cidade_nome,
                    'estado' => ['id' => $o->estado_id, 'nome' => $o->estado_nome, 'sigla' => $o->estado_sigla],
                ],
            ] : null,
            transporte: $o->transporte_id ? [
                'id' => $o->transporte_id,
                'empresa' => $o->transporte_empresa,
                'meio' => $o->transporte_meio,
                'preco' => (int) $o->transporte_preco,
            ] : null,
        ), $ofertas);

        $menorPreco = !empty($ofertaDTOs)
            ? min(array_map(fn($o) => $o->preco, $ofertaDTOs))
            : null;

        return new PacoteDetalhesDTO(
            id: $pacote->id,
            nome: $pacote->nome,
            descricao: $pacote->descricao,
            fotoCapa: $fotoCapa,
            tags: array_map(fn($t) => ['id' => $t->id, 'nome' => $t->nome], $tags),
            ofertas: $ofertaDTOs,
            fotos: $fotos,
            ofertasAtivas: count($ofertaDTOs),
            menorPreco: $menorPreco,
            mediaAvaliacao: $pacote->mediaAvaliacao,
            totalAvaliacoes: $pacote->totalAvaliacoes,
        );
    }

    /** @return PacoteAdminDTO[] */
    public function listarAdmin(): array
    {
        $rows = $this->repo->listarAdmin();

        return array_map(fn($r) => new PacoteAdminDTO(
            id: $r->id,
            nome: $r->nome,
            descricao: $r->descricao,
            funcionarioNome: $r->funcionario_nome ?? null,
            fotoCapa: isset($r->pf_foto_capa)
                ? ($r->pf_is_url ? $r->pf_foto_capa : ($r->pf_foto_capa ? Storage::url($r->pf_foto_capa) : null))
                : null,
            createdAt: $r->created_at,
        ), $rows);
    }

    public function criar(array $dados, string $tagsString): int
    {
        $tagIds = $this->processarTags($tagsString);
        $dados['tag_ids'] = $tagIds;

        $id = $this->repo->criar($dados);
        $this->repo->sincronizarTags($id, $tagIds);

        $this->log->logCreated('Pacote', $id, ['nome' => $dados['nome']]);

        return $id;
    }

    public function atualizar(int $id, array $dados, string $tagsString): bool
    {
        $tagIds = $this->processarTags($tagsString);
        $dados['tag_ids'] = $tagIds;

        $result = $this->repo->atualizar($id, $dados);
        $this->repo->sincronizarTags($id, $tagIds);

        $this->log->logUpdated('Pacote', $id, [], $dados);

        return $result;
    }

    public function deletar(int $id): bool
    {
        $this->log->logDeleted('Pacote', $id);
        return $this->repo->deletar($id);
    }

    public function buscarPorId(int $id): ?\App\Domain\Catalogo\Entities\Pacote
    {
        return $this->repo->buscarPorId($id);
    }

    public function listarTags(): array
    {
        return $this->repo->listarTags();
    }

    public function buscarTagsDoPacote(int $pacoteId): string
    {
        $tags = $this->repo->buscarTagsDoPacote($pacoteId);
        return implode(', ', array_map(fn($t) => $t->nome, $tags));
    }

    private function processarTags(string $tagsString): array
    {
        $names = array_filter(array_map('trim', explode(',', $tagsString)));
        return array_map(fn($name) => $this->repo->buscarOuCriarTag($name), $names);
    }
}
