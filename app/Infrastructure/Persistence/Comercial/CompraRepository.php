<?php

namespace App\Infrastructure\Persistence\Comercial;

use App\Domain\Comercial\Entities\Compra;
use App\Domain\Comercial\Repositories\CompraRepositoryInterface;
use App\Domain\Comercial\Enums\Metodo;
use App\Domain\Comercial\Enums\Processador;
use App\Domain\Comercial\Enums\StatusCompra;
use App\Domain\Comercial\DTOs\CompraDetalhesDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompraRepository implements CompraRepositoryInterface
{
    public function buscarPorId(string $id): ?Compra
    {
        $row = DB::table('compras')->where('id', $id)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function listarPorUsuario(string $userId, string $view = 'andamento'): array
    {
        $query = DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->join('pacotes', 'ofertas.pacote_id', '=', 'pacotes.id')
            ->leftJoin('pacote_fotos', 'pacotes.pacote_foto_id', '=', 'pacote_fotos.id')
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('avaliacoes', 'compras.id', '=', 'avaliacoes.compra_id')
            ->where('compras.user_id', $userId);

        if ($view === 'concluidas') {
            $query->where('ofertas.fim', '<', now());
        } else {
            $query->where('ofertas.fim', '>=', now());
        }

        return $query
            ->select(
                'compras.*',
                'ofertas.id as oferta_id',
                'ofertas.inicio as oferta_inicio',
                'ofertas.fim as oferta_fim',
                'ofertas.preco as oferta_preco',
                'ofertas.disponibilidade as oferta_disponibilidade',
                'ofertas.status as oferta_status',
                'ofertas.is_available as oferta_is_available',
                'pacotes.id as pacote_id',
                'pacotes.nome as pacote_nome',
                'pacotes.descricao as pacote_descricao',
                'pacote_fotos.foto_capa as pf_foto_capa',
                'pacote_fotos.is_url as pf_is_url',
                'hotels.id as hotel_id',
                'hotels.nome as hotel_nome',
                'cidades.nome as cidade_nome',
                'estados.sigla as estado_sigla',
                'avaliacoes.id as avaliacao_id',
                'avaliacoes.nota as avaliacao_nota'
            )
            ->latest('compras.data_compra')
            ->get()
            ->all();
    }

    public function buscarDetalhesCompleto(string $id, string $userId): ?CompraDetalhesDTO
    {
        $compra = DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->join('pacotes', 'ofertas.pacote_id', '=', 'pacotes.id')
            ->leftJoin('pacote_fotos', 'pacotes.pacote_foto_id', '=', 'pacote_fotos.id')
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('transportes', 'ofertas.transporte_id', '=', 'transportes.id')
            ->leftJoin('avaliacoes', 'compras.id', '=', 'avaliacoes.compra_id')
            ->where('compras.id', $id)
            ->where('compras.user_id', $userId)
            ->select(
                'compras.*',
                'ofertas.id as oferta_id',
                'ofertas.inicio as oferta_inicio',
                'ofertas.fim as oferta_fim',
                'transportes.meio as transporte_meio',
                'transportes.empresa as transporte_empresa',
                'pacotes.id as pacote_id',
                'pacotes.nome as pacote_nome',
                'pacotes.descricao as pacote_descricao',
                'pacote_fotos.foto_capa as pf_foto_capa',
                'pacote_fotos.is_url as pf_is_url',
                'hotels.nome as hotel_nome',
                'cidades.nome as cidade_nome',
                'estados.sigla as estado_sigla',
                'avaliacoes.id as avaliacao_id',
                'avaliacoes.nota as avaliacao_nota'
            )
            ->first();

        if (!$compra) return null;

        $tags = DB::table('pacote_tag')
            ->join('tags', 'pacote_tag.tag_id', '=', 'tags.id')
            ->where('pacote_tag.pacote_id', $compra->pacote_id)
            ->select('tags.nome')
            ->get()
            ->all();

        $avaliacaoData = null;
        if (isset($compra->avaliacao_id)) {
            $avaliacaoData = [
                'id' => $compra->avaliacao_id,
                'nota' => (int) $compra->avaliacao_nota,
            ];
        }

        return new CompraDetalhesDTO(
            id: $compra->id,
            valorFinal: (float) $compra->valor_final,
            status: $compra->status,
            dataCompra: $compra->data_compra,
            metodo: $compra->metodo,
            processadorPagamento: $compra->processador_pagamento,
            parcelas: $compra->parcelas,
            oferta: [
                'id' => $compra->oferta_id,
                'inicio' => $compra->oferta_inicio,
                'fim' => $compra->oferta_fim,
                'transporte' => [
                    'meio' => $compra->transporte_meio ?? 'Aéreo',
                    'empresa' => $compra->transporte_empresa ?? 'Azul/Gol/LATAM',
                ],
                'hotel' => [
                    'nome' => $compra->hotel_nome,
                    'cidade' => [
                        'nome' => $compra->cidade_nome,
                        'estado' => ['sigla' => $compra->estado_sigla],
                    ],
                ],
                'pacote' => [
                    'id' => $compra->pacote_id,
                    'nome' => $compra->pacote_nome,
                    'descricao' => $compra->pacote_descricao,
                    'fotos_do_pacote' => [
                        'foto_capa_url' => $compra->pf_is_url ? $compra->pf_foto_capa : ($compra->pf_foto_capa ? \Illuminate\Support\Facades\Storage::url($compra->pf_foto_capa) : null),
                        'fotos' => [],
                    ],
                    'tags' => array_map(fn($t) => ['nome' => $t->nome], $tags),
                ],
            ],
            avaliacao: $avaliacaoData
        );
    }

    public function listarPorPacote(int $pacoteId): array
    {
        return DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->where('ofertas.pacote_id', $pacoteId)
            ->leftJoin('users', 'compras.user_id', '=', 'users.id')
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->select(
                'compras.*',
                'users.nome as user_nome',
                'users.email as user_email',
                'ofertas.preco as oferta_preco',
                'hotels.nome as hotel_nome',
                'cidades.nome as cidade_nome',
            )
            ->latest('compras.data_compra')
            ->get()
            ->all();
    }

    public function listarPorUsuarioAdmin(string $userId): array
    {
        return DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->leftJoin('pacotes', 'ofertas.pacote_id', '=', 'pacotes.id')
            ->leftJoin('pacote_fotos', 'pacotes.pacote_foto_id', '=', 'pacote_fotos.id')
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->where('compras.user_id', $userId)
            ->select(
                'compras.*',
                'ofertas.preco as oferta_preco',
                'pacotes.nome as pacote_nome',
                'pacote_fotos.foto_capa as pf_foto_capa',
                'pacote_fotos.is_url as pf_is_url',
                'hotels.nome as hotel_nome',
                'cidades.nome as cidade_nome',
            )
            ->latest('compras.data_compra')
            ->get()
            ->all();
    }

    public function criar(array $dados): string
    {
        $id = $dados['id'] ?? (string) Str::uuid();
        DB::table('compras')->insert([
            'id' => $id,
            'data_compra' => $dados['data_compra'],
            'status' => $dados['status'],
            'metodo' => $dados['metodo'],
            'processador_pagamento' => $dados['processador_pagamento'],
            'parcelas' => $dados['parcelas'],
            'valor_final' => $dados['valor_final'],
            'user_id' => $dados['user_id'],
            'oferta_id' => $dados['oferta_id'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return $id;
    }

    // === Estatísticas ===

    public function comprasPorMesEStatus(int $ano): array
    {
        $yearSql = 'EXTRACT(YEAR FROM data_compra)';
        $monthSql = 'EXTRACT(MONTH FROM data_compra)';

        return DB::table('compras')
            ->selectRaw("CAST({$monthSql} AS INTEGER) as mes, status, count(*) as total")
            ->whereRaw("CAST({$yearSql} AS INTEGER) = ?", [$ano])
            ->groupBy('mes', 'status')
            ->get()
            ->map(fn($item) => (object) ['mes' => (int) $item->mes, 'status' => $item->status, 'total' => (int) $item->total])
            ->all();
    }

    public function anosComCompras(): array
    {
        $yearSql = 'EXTRACT(YEAR FROM data_compra)';
        $anos = DB::table('compras')
            ->selectRaw("CAST({$yearSql} AS INTEGER) as ano")
            ->distinct()
            ->orderBy('ano', 'desc')
            ->pluck('ano')
            ->map(fn($a) => (int) $a)
            ->all();

        return !empty($anos) ? $anos : [(int) date('Y')];
    }

    public function destinosPopulares(int $ano, ?int $regiaoId = null, ?int $estadoId = null): array
    {
        $yearSql = 'EXTRACT(YEAR FROM data_compra)';

        $query = DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->join('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->join('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->join('estados', 'cidades.estado_id', '=', 'estados.id')
            ->join('regiaos', 'estados.regiao_id', '=', 'regiaos.id')
            ->select('cidades.nome as cidade', 'estados.sigla as estado', DB::raw('count(compras.id) as total'))
            ->where('compras.status', '=', 'ACEITO')
            ->whereRaw("CAST({$yearSql} AS INTEGER) = ?", [$ano]);

        if ($regiaoId) $query->where('regiaos.id', $regiaoId);
        if ($estadoId) $query->where('estados.id', $estadoId);

        return $query
            ->groupBy('cidades.id', 'cidades.nome', 'estados.sigla')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->all();
    }

    public function crescimentoUsuariosPorAno(): array
    {
        $yearSql = 'EXTRACT(YEAR FROM created_at)';
        return DB::table('users')
            ->selectRaw("CAST({$yearSql} AS INTEGER) as ano, count(*) as total")
            ->groupBy('ano')
            ->orderBy('ano', 'asc')
            ->get()
            ->all();
    }

    private function hydrate(object $row): Compra
    {
        return new Compra(
            id: $row->id,
            dataCompra: $row->data_compra,
            status: StatusCompra::from($row->status),
            metodo: Metodo::from($row->metodo),
            processadorPagamento: Processador::from($row->processador_pagamento),
            parcelas: $row->parcelas,
            valorFinal: (float) $row->valor_final,
            userId: $row->user_id,
            ofertaId: $row->oferta_id,
            createdAt: $row->created_at,
            updatedAt: $row->updated_at,
        );
    }
}
