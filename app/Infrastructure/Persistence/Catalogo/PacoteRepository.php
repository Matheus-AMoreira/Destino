<?php

namespace App\Infrastructure\Persistence\Catalogo;

use App\Domain\Catalogo\Entities\Pacote;
use App\Domain\Catalogo\Entities\PacoteFoto;
use App\Domain\Catalogo\Entities\FotoItem;
use App\Domain\Catalogo\Entities\Tag;
use App\Domain\Catalogo\Repositories\PacoteRepositoryInterface;
use App\Domain\Shared\PaginatedResult;
use App\Enums\Meio;
use App\Enums\OfertaStatus;
use Illuminate\Support\Facades\DB;

class PacoteRepository implements PacoteRepositoryInterface
{
    // ===================== PACOTES =====================

    public function paginar(int $perPage = 12, int $page = 1): PaginatedResult
    {
        $query = DB::table('pacotes')
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                  ->from('ofertas')
                  ->whereColumn('ofertas.pacote_id', 'pacotes.id');
            })
            ->select('pacotes.*')
            ->latest('pacotes.created_at');

        $total = $query->count();
        $items = $query->forPage($page, $perPage)->get()->all();

        return new PaginatedResult(
            items: $items,
            total: $total,
            page: $page,
            perPage: $perPage,
        );
    }

    public function buscar(string $termo, int $precoMax, int $perPage = 12, int $page = 1): PaginatedResult
    {
        $query = DB::table('pacotes')
            ->whereExists(function ($q) use ($precoMax) {
                $q->select(DB::raw(1))
                  ->from('ofertas')
                  ->whereColumn('ofertas.pacote_id', 'pacotes.id')
                  ->where('ofertas.is_available', true);

                if ($precoMax > 0) {
                    $q->where('ofertas.preco', '<=', $precoMax);
                }
            })
            ->select('pacotes.*');

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                $q->where('pacotes.nome', 'ilike', "%{$termo}%")
                  ->orWhere('pacotes.descricao', 'ilike', "%{$termo}%");
            });
        }

        $query->latest('pacotes.created_at');
        $total = $query->count();
        $items = $query->forPage($page, $perPage)->get()->all();

        return new PaginatedResult(
            items: $items,
            total: $total,
            page: $page,
            perPage: $perPage,
        );
    }

    public function buscarPorNome(string $nome): ?Pacote
    {
        $row = DB::table('pacotes')->where('nome', $nome)->first();
        return $row ? $this->hydratePacote($row) : null;
    }

    public function buscarPorId(int $id): ?Pacote
    {
        $row = DB::table('pacotes')->where('id', $id)->first();
        return $row ? $this->hydratePacote($row) : null;
    }

    public function listarAdmin(): array
    {
        return DB::table('pacotes')
            ->leftJoin('users', 'pacotes.funcionario_id', '=', 'users.id')
            ->leftJoin('pacote_fotos', 'pacotes.pacote_foto_id', '=', 'pacote_fotos.id')
            ->select(
                'pacotes.*',
                'users.nome as funcionario_nome',
                'pacote_fotos.foto_capa as pf_foto_capa',
                'pacote_fotos.is_url as pf_is_url',
            )
            ->latest('pacotes.created_at')
            ->get()
            ->all();
    }

    public function criar(array $dados): int
    {
        return DB::table('pacotes')->insertGetId([
            'nome' => $dados['nome'],
            'descricao' => $dados['descricao'],
            'funcionario_id' => $dados['funcionario_id'],
            'pacote_foto_id' => $dados['pacote_foto_id'] ?? null,
            'tag_ids' => isset($dados['tag_ids']) ? json_encode($dados['tag_ids']) : null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function atualizar(int $id, array $dados): bool
    {
        $dados['updated_at'] = now();
        if (isset($dados['tag_ids'])) {
            $dados['tag_ids'] = json_encode($dados['tag_ids']);
        }
        return DB::table('pacotes')->where('id', $id)->update($dados) > 0;
    }

    public function deletar(int $id): bool
    {
        return DB::table('pacotes')->where('id', $id)->delete() > 0;
    }

    public function contar(): int
    {
        return DB::table('pacotes')->count();
    }

    // ===================== TAGS =====================

    public function listarTags(): array
    {
        return DB::table('tags')->get()->map(
            fn($row) => new Tag($row->id, $row->nome)
        )->all();
    }

    public function buscarOuCriarTag(string $nome): int
    {
        $existing = DB::table('tags')->where('nome', $nome)->first();
        if ($existing) {
            return $existing->id;
        }

        return DB::table('tags')->insertGetId([
            'nome' => $nome,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function sincronizarTags(int $pacoteId, array $tagIds): void
    {
        DB::table('pacote_tag')->where('pacote_id', $pacoteId)->delete();

        $records = array_map(fn(int $tagId) => [
            'pacote_id' => $pacoteId,
            'tag_id' => $tagId,
            'created_at' => now(),
            'updated_at' => now(),
        ], $tagIds);

        if (!empty($records)) {
            DB::table('pacote_tag')->insert($records);
        }
    }

    public function buscarTagsDoPacote(int $pacoteId): array
    {
        return DB::table('tags')
            ->join('pacote_tag', 'tags.id', '=', 'pacote_tag.tag_id')
            ->where('pacote_tag.pacote_id', $pacoteId)
            ->select('tags.*')
            ->get()
            ->map(fn($row) => new Tag($row->id, $row->nome))
            ->all();
    }

    // ===================== FOTOS =====================

    public function listarAlbuns(): array
    {
        return DB::table('pacote_fotos')
            ->select('pacote_fotos.*')
            ->selectSub(
                DB::table('pacote_foto_items')
                    ->selectRaw('count(*)')
                    ->whereColumn('pacote_foto_items.pacote_foto_id', 'pacote_fotos.id'),
                'fotos_count'
            )
            ->get()
            ->all();
    }

    public function buscarAlbumPorId(int $id): ?PacoteFoto
    {
        $row = DB::table('pacote_fotos')->where('id', $id)->first();
        return $row ? new PacoteFoto(
            id: $row->id,
            nome: $row->nome,
            fotoCapa: $row->foto_capa,
            storageType: $row->storage_type,
            isUrl: (bool) $row->is_url,
        ) : null;
    }

    public function criarAlbum(array $dados): int
    {
        return DB::table('pacote_fotos')->insertGetId([
            'nome' => $dados['nome'],
            'foto_capa' => $dados['foto_capa'],
            'is_url' => $dados['is_url'] ?? false,
            'storage_type' => $dados['storage_type'] ?? 'local',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function atualizarAlbum(int $id, array $dados): bool
    {
        $dados['updated_at'] = now();
        return DB::table('pacote_fotos')->where('id', $id)->update($dados) > 0;
    }

    public function deletarAlbum(int $id): bool
    {
        return DB::table('pacote_fotos')->where('id', $id)->delete() > 0;
    }

    public function buscarFotosDoAlbum(int $albumId): array
    {
        return DB::table('pacote_foto_items')
            ->where('pacote_foto_id', $albumId)
            ->orderBy('ordem')
            ->get()
            ->map(fn($row) => new FotoItem(
                id: $row->id,
                pacoteFotoId: $row->pacote_foto_id,
                caminho: $row->caminho,
                ordem: $row->ordem,
                isUrl: (bool) $row->is_url,
            ))
            ->all();
    }

    public function criarFotoItem(array $dados): int
    {
        return DB::table('pacote_foto_items')->insertGetId([
            'pacote_foto_id' => $dados['pacote_foto_id'],
            'caminho' => $dados['caminho'],
            'is_url' => $dados['is_url'] ?? false,
            'ordem' => $dados['ordem'] ?? 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function atualizarFotoItem(int $id, array $dados): bool
    {
        $dados['updated_at'] = now();
        return DB::table('pacote_foto_items')->where('id', $id)->update($dados) > 0;
    }

    public function deletarFotoItem(int $id): bool
    {
        return DB::table('pacote_foto_items')->where('id', $id)->delete() > 0;
    }

    public function buscarFotoItemPorId(int $id): ?FotoItem
    {
        $row = DB::table('pacote_foto_items')->where('id', $id)->first();
        return $row ? new FotoItem(
            id: $row->id,
            pacoteFotoId: $row->pacote_foto_id,
            caminho: $row->caminho,
            ordem: $row->ordem,
            isUrl: (bool) $row->is_url,
        ) : null;
    }

    public function contarFotosDoAlbum(int $albumId): int
    {
        return DB::table('pacote_foto_items')
            ->where('pacote_foto_id', $albumId)
            ->count();
    }

    // ===================== QUERIES COMPLEXAS =====================

    public function carregarRelacoesDePacotes(array $pacoteIds): array
    {
        if (empty($pacoteIds)) {
            return ['tags' => [], 'fotos' => [], 'ofertas_count' => [], 'cheapest' => [], 'latest' => []];
        }

        // Tags por pacote
        $tagsRaw = DB::table('tags')
            ->join('pacote_tag', 'tags.id', '=', 'pacote_tag.tag_id')
            ->whereIn('pacote_tag.pacote_id', $pacoteIds)
            ->select('tags.*', 'pacote_tag.pacote_id')
            ->get();

        $tagsGrouped = [];
        foreach ($tagsRaw as $t) {
            $tagsGrouped[$t->pacote_id][] = new Tag($t->id, $t->nome);
        }

        // Fotos (buscar pacote_foto_id dos pacotes)
        $pacoteFotoIds = DB::table('pacotes')
            ->whereIn('id', $pacoteIds)
            ->whereNotNull('pacote_foto_id')
            ->pluck('pacote_foto_id', 'id')
            ->all();

        $fotoIds = array_unique(array_values(array_filter($pacoteFotoIds)));
        $fotosRaw = !empty($fotoIds) ? DB::table('pacote_fotos')
            ->whereIn('id', $fotoIds)
            ->get()
            ->keyBy('id')
            ->all() : [];

        $fotosGrouped = [];
        foreach ($pacoteFotoIds as $pacoteId => $fotoId) {
            if (isset($fotosRaw[$fotoId])) {
                $f = $fotosRaw[$fotoId];
                $fotosGrouped[$pacoteId] = new PacoteFoto(
                    id: $f->id,
                    nome: $f->nome,
                    fotoCapa: $f->foto_capa,
                    storageType: $f->storage_type,
                    isUrl: (bool) $f->is_url,
                );
            }
        }

        // Active Ofertas Count
        $ofertasCount = DB::table('ofertas')
            ->whereIn('pacote_id', $pacoteIds)
            ->where('is_available', true)
            ->select('pacote_id', DB::raw('count(*) as count'))
            ->groupBy('pacote_id')
            ->pluck('count', 'pacote_id')
            ->all();

        // Cheapest offers
        $cheapest = $this->getSpecialOffers($pacoteIds, 'min', 'preco');

        // Latest offers
        $latest = $this->getSpecialOffers($pacoteIds, 'max', 'created_at');

        return [
            'tags' => $tagsGrouped,
            'fotos' => $fotosGrouped,
            'ofertas_count' => $ofertasCount,
            'cheapest' => $cheapest,
            'latest' => $latest,
        ];
    }

    public function carregarOfertasDisponiveisDoPacote(int $pacoteId): array
    {
        return DB::table('ofertas')
            ->where('pacote_id', $pacoteId)
            ->where('is_available', true)
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('transportes', 'ofertas.transporte_id', '=', 'transportes.id')
            ->select(
                'ofertas.*',
                'hotels.nome as hotel_nome',
                'hotels.endereco as hotel_endereco',
                'hotels.diaria as hotel_diaria',
                'cidades.id as cidade_id',
                'cidades.nome as cidade_nome',
                'estados.id as estado_id',
                'estados.nome as estado_nome',
                'estados.sigla as estado_sigla',
                'transportes.empresa as transporte_empresa',
                'transportes.meio as transporte_meio',
                'transportes.preco as transporte_preco',
            )
            ->get()
            ->all();
    }

    // ===================== PRIVATE HELPERS =====================

    private function hydratePacote(object $row): Pacote
    {
        $tagIds = [];
        if (!empty($row->tag_ids)) {
            $decoded = is_string($row->tag_ids) ? json_decode($row->tag_ids, true) : $row->tag_ids;
            $tagIds = is_array($decoded) ? $decoded : [];
        }

        return new Pacote(
            id: $row->id,
            nome: $row->nome,
            descricao: $row->descricao,
            funcionarioId: $row->funcionario_id,
            pacoteFotoId: $row->pacote_foto_id ? (int) $row->pacote_foto_id : null,
            tagIds: $tagIds,
            createdAt: $row->created_at,
            updatedAt: $row->updated_at,
        );
    }

    private function getSpecialOffers(array $pacoteIds, string $type, string $column): array
    {
        $subQuery = DB::table('ofertas')
            ->whereIn('pacote_id', $pacoteIds)
            ->where('is_available', true)
            ->select('pacote_id', DB::raw("{$type}({$column}) as val"))
            ->groupBy('pacote_id');

        return DB::table('ofertas')
            ->joinSub($subQuery, 'special', function ($join) use ($column) {
                $join->on('ofertas.pacote_id', '=', 'special.pacote_id')
                     ->on("ofertas.{$column}", '=', 'special.val');
            })
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('transportes', 'ofertas.transporte_id', '=', 'transportes.id')
            ->select(
                'ofertas.*',
                'hotels.nome as hotel_nome',
                'hotels.endereco as hotel_endereco',
                'hotels.diaria as hotel_diaria',
                'cidades.id as cidade_id',
                'cidades.nome as cidade_nome',
                'estados.id as estado_id',
                'estados.nome as estado_nome',
                'estados.sigla as estado_sigla',
                'transportes.empresa as transporte_empresa',
                'transportes.meio as transporte_meio',
                'transportes.preco as transporte_preco',
            )
            ->get()
            ->keyBy('pacote_id')
            ->all();
    }
}
