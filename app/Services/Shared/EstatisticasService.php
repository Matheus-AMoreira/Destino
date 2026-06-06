<?php

namespace App\Services\Shared;

use App\Models\Identidade\Usuario;
use App\Models\Hospedagem\Hotel;
use App\Models\Hospedagem\Transporte;
use App\Models\Catalogo\Pacote;
use App\Models\Comercial\Oferta;
use App\DTOs\Shared\EstatisticasDTO;
use App\DTOs\Shared\AtividadeRecenteDTO;
use App\DTOs\Shared\DadosGraficosDTO;
use Illuminate\Support\Facades\DB;

class EstatisticasService
{
    public function obterEstatisticasGerais(): EstatisticasDTO
    {
        return new EstatisticasDTO(
            usuarios: Usuario::count(),
            hoteis: Hotel::count(),
            transportes: Transporte::count(),
            pacotes: Pacote::count(),
            ofertas: Oferta::count(),
        );
    }

    /** @return AtividadeRecenteDTO[] */
    public function obterAtividadesRecentes(int $limit = 5): array
    {
        $rows = DB::table('activity_log')
            ->leftJoin('users', 'activity_log.causer_id', '=', DB::raw('CAST(users.id AS text)'))
            ->select(
                'activity_log.id',
                'activity_log.description',
                'activity_log.created_at',
                'users.nome as causer_nome',
                'users.sobre_nome as causer_sobrenome'
            )
            ->orderByDesc('activity_log.created_at')
            ->limit($limit)
            ->get()
            ->all();

        return array_map(fn($row) => new AtividadeRecenteDTO(
            id: $row->id,
            description: $this->formatarDescricao($row->description),
            time: \Carbon\Carbon::parse($row->created_at)->diffForHumans(),
            causer: $row->causer_nome ? "{$row->causer_nome} {$row->causer_sobrenome}" : 'Sistema',
        ), $rows);
    }

    private function formatarDescricao(string $event): string
    {
        return match($event) {
            'created' => 'criou um novo registro',
            'updated' => 'atualizou um registro',
            'deleted' => 'removeu um registro',
            default => $event,
        };
    }

    public function obterDadosGraficos(int $anoSelecionado, ?int $regiaoId = null, ?int $estadoId = null): DadosGraficosDTO
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $yearSql = $isSqlite ? "strftime('%Y', data_compra)" : 'EXTRACT(YEAR FROM data_compra)';
        $monthSql = $isSqlite ? "strftime('%m', data_compra)" : 'EXTRACT(MONTH FROM data_compra)';
        $userYearSql = $isSqlite ? "strftime('%Y', created_at)" : 'EXTRACT(YEAR FROM created_at)';

        $comprasMesStatus = DB::table('compras')
            ->selectRaw("CAST({$monthSql} AS INTEGER) as mes, status, count(*) as total")
            ->whereRaw("CAST({$yearSql} AS INTEGER) = ?", [$anoSelecionado])
            ->groupBy('mes', 'status')
            ->get()
            ->map(fn($item) => (object) ['mes' => (int) $item->mes, 'status' => $item->status, 'total' => (int) $item->total])
            ->all();

        $query = DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->join('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->join('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->join('estados', 'cidades.estado_id', '=', 'estados.id')
            ->join('regiaos', 'estados.regiao_id', '=', 'regiaos.id')
            ->select('cidades.nome as cidade', 'estados.sigla as estado', DB::raw('count(compras.id) as total'))
            ->where('compras.status', '=', 'ACEITO')
            ->whereRaw("CAST({$yearSql} AS INTEGER) = ?", [$anoSelecionado]);

        if ($regiaoId) $query->where('regiaos.id', $regiaoId);
        if ($estadoId) $query->where('estados.id', $estadoId);

        $destinosPopulares = $query
            ->groupBy('cidades.id', 'cidades.nome', 'estados.sigla')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->all();

        $crescimentoUsuarios = DB::table('users')
            ->selectRaw("CAST({$userYearSql} AS INTEGER) as ano, count(*) as total")
            ->groupBy('ano')
            ->orderBy('ano', 'asc')
            ->get()
            ->all();

        $anos = DB::table('compras')
            ->selectRaw("CAST({$yearSql} AS INTEGER) as ano")
            ->distinct()
            ->orderBy('ano', 'desc')
            ->pluck('ano')
            ->map(fn($a) => (int) $a)
            ->all();

        $anosDisponiveis = !empty($anos) ? $anos : [(int) date('Y')];

        $dadosCompras = [
            'meses' => ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            'ACEITO' => array_fill(0, 12, 0),
            'PENDENTE' => array_fill(0, 12, 0),
            'RECUSADO' => array_fill(0, 12, 0),
        ];

        foreach ($comprasMesStatus as $row) {
            if ($row->mes >= 1 && $row->mes <= 12 && isset($dadosCompras[$row->status])) {
                $dadosCompras[$row->status][$row->mes - 1] = $row->total;
            }
        }

        return new DadosGraficosDTO(
            compras: $dadosCompras,
            destinosPopulares: $destinosPopulares,
            crescimentoUsuarios: [
                'anos' => array_column($crescimentoUsuarios, 'ano'),
                'totais' => array_column($crescimentoUsuarios, 'total'),
            ],
            anosDisponiveis: $anosDisponiveis,
        );
    }
}
