<?php

namespace App\Repositories\Catalogo;

use App\Models\Catalogo\Pacote;
use App\Models\Catalogo\Tag;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PacoteRepository
{
    public function obterTodosParaAdmin(): array
    {
        return Pacote::query()
            ->with(['album', 'funcionario'])
            ->latest('created_at')
            ->get()
            ->map(fn(Pacote $p) => [
                'id' => $p->id,
                'nome' => $p->nome,
                'descricao' => $p->descricao,
                'funcionarioNome' => $p->funcionario ? ($p->funcionario->nome . ' ' . $p->funcionario->sobre_nome) : null,
                'fotoCapa' => $p->album ? ($p->album->is_url ? $p->album->foto_capa : ($p->album->foto_capa ? Storage::url($p->album->foto_capa) : null)) : null,
                'createdAt' => $p->created_at?->toIso8601String(),
            ])
            ->toArray();
    }

    public function buscarPorIdParaEditar(int $id): ?Pacote
    {
        return Pacote::query()->with('tags')->find($id);
    }

    public function buscarPorNome(string $nome): ?Pacote
    {
        return Pacote::query()
            ->with(['album.items', 'tags'])
            ->where('nome', $nome)
            ->first();
    }

    public function processarTags(?string $tagsString): array
    {
        if (empty($tagsString)) {
            return [];
        }

        $names = array_filter(array_map('trim', explode(',', $tagsString)));
        $tagIds = [];

        foreach ($names as $name) {
            $tag = Tag::firstOrCreate(['nome' => $name]);
            $tagIds[] = $tag->id;
        }

        return $tagIds;
    }

    public function obterPacotesComOfertasPaginado(int $page, int $perPage): array
    {
        $query = Pacote::query()
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                  ->from('ofertas')
                  ->whereColumn('ofertas.pacote_id', 'pacotes.id')
                  ->where('ofertas.is_available', true)
                  ->where('ofertas.inicio', '>', now()->toDateString());
            })
            ->latest('created_at');

        $total = $query->count();
        $items = $query->forPage($page, $perPage)
            ->with(['album', 'tags'])
            ->get();

        $pacoteIds = $items->pluck('id')->toArray();

        // Contagem de ofertas ativas por pacote
        $activeCounts = DB::table('ofertas')
            ->whereIn('pacote_id', $pacoteIds)
            ->where('is_available', true)
            ->where('inicio', '>', now()->toDateString())
            ->select('pacote_id', DB::raw('count(*) as count'))
            ->groupBy('pacote_id')
            ->pluck('count', 'pacote_id')
            ->toArray();

        // Subquery para obter o menor preço de oferta por pacote
        $subQuery = DB::table('ofertas')
            ->whereIn('pacote_id', $pacoteIds)
            ->where('is_available', true)
            ->where('inicio', '>', now()->toDateString())
            ->select('pacote_id', DB::raw("min(preco) as val"))
            ->groupBy('pacote_id');

        $cheapestOffers = DB::table('ofertas')
            ->joinSub($subQuery, 'special', function ($join) {
                $join->on('ofertas.pacote_id', '=', 'special.pacote_id')
                     ->on("ofertas.preco", '=', 'special.val');
            })
            ->where('ofertas.is_available', true)
            ->where('ofertas.inicio', '>', now()->toDateString())
            ->select('ofertas.*')
            ->get()
            ->keyBy('pacote_id')
            ->toArray();

        return [
            'total' => $total,
            'items' => $items,
            'activeCounts' => $activeCounts,
            'cheapestOffers' => $cheapestOffers,
        ];
    }

    public function buscarPacotesFiltradosPaginado(string $termo, int $precoMax, int $page, int $perPage): array
    {
        $query = Pacote::query()
            ->whereExists(function ($q) use ($precoMax) {
                $q->select(DB::raw(1))
                  ->from('ofertas')
                  ->whereColumn('ofertas.pacote_id', 'pacotes.id')
                  ->where('ofertas.is_available', true)
                  ->where('ofertas.inicio', '>', now()->toDateString());

                if ($precoMax > 0) {
                    $q->where('ofertas.preco', '<=', $precoMax);
                }
            });

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                $q->where('pacotes.nome', 'ilike', "%{$termo}%")
                  ->orWhere('pacotes.descricao', 'ilike', "%{$termo}%");
            });
        }

        $query->latest('pacotes.created_at');
        $total = $query->count();
        $items = $query->forPage($page, $perPage)
            ->with(['album', 'tags'])
            ->get();

        $pacoteIds = $items->pluck('id')->toArray();

        // Contagem de ofertas ativas
        $activeCounts = DB::table('ofertas')
            ->whereIn('pacote_id', $pacoteIds)
            ->where('is_available', true)
            ->where('inicio', '>', now()->toDateString())
            ->select('pacote_id', DB::raw('count(*) as count'))
            ->groupBy('pacote_id')
            ->pluck('count', 'pacote_id')
            ->toArray();

        // Menor preço de oferta
        $subQuery = DB::table('ofertas')
            ->whereIn('pacote_id', $pacoteIds)
            ->where('is_available', true)
            ->where('inicio', '>', now()->toDateString())
            ->select('pacote_id', DB::raw("min(preco) as val"))
            ->groupBy('pacote_id');

        $cheapestOffers = DB::table('ofertas')
            ->joinSub($subQuery, 'special', function ($join) {
                $join->on('ofertas.pacote_id', '=', 'special.pacote_id')
                     ->on("ofertas.preco", '=', 'special.val');
            })
            ->where('ofertas.is_available', true)
            ->where('ofertas.inicio', '>', now()->toDateString())
            ->select('ofertas.*')
            ->get()
            ->keyBy('pacote_id')
            ->toArray();

        return [
            'total' => $total,
            'items' => $items,
            'activeCounts' => $activeCounts,
            'cheapestOffers' => $cheapestOffers,
        ];
    }

    public function obterOfertasAtivasDoPacote(int $pacoteId): array
    {
        return DB::table('ofertas')
            ->where('pacote_id', $pacoteId)
            ->where('is_available', true)
            ->where('inicio', '>', now()->toDateString())
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
                'transportes.preco as transporte_preco'
            )
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'preco' => (float) $o->preco,
                'inicio' => $o->inicio,
                'fim' => $o->fim,
                'disponibilidade' => $o->disponibilidade,
                'status' => $o->status,
                'isAvailable' => (bool) $o->is_available,
                'hotel' => $o->hotel_id ? [
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
                'transporte' => $o->transporte_id ? [
                    'id' => $o->transporte_id,
                    'empresa' => $o->transporte_empresa,
                    'meio' => $o->transporte_meio,
                    'preco' => (int) $o->transporte_preco,
                ] : null,
            ])
            ->toArray();
    }
}
