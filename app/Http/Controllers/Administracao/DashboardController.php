<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\Estado;
use App\Models\Hotel;
use App\Models\Oferta;
use App\Models\Pacote;
use App\Models\Regiao;
use App\Models\Transporte;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/Dashboard', [
            'stats' => [
                'hoteis' => Hotel::count(),
                'transportes' => Transporte::count(),
                'pacotes' => Pacote::count(),
                'ofertas' => Oferta::count(),
                'usuarios' => User::count(),
            ],
        ]);
    }

    public function estatisticas(Request $request): Response
    {
        $ano = $request->integer('ano', (int) date('Y'));
        $driver = DB::connection()->getDriverName();

        $isPgsql = in_array($driver, ['pgsql', 'postgres', 'postgresql']);

        $yearSql = $isPgsql ? 'EXTRACT(YEAR FROM data_compra)' : 'YEAR(data_compra)';
        $monthSql = $isPgsql ? 'EXTRACT(MONTH FROM data_compra)' : 'MONTH(data_compra)';

        $anosDisponiveis = Compra::selectRaw("CAST($yearSql AS INTEGER) as ano")
            ->distinct()
            ->orderBy('ano', 'desc')
            ->pluck('ano')
            ->map(fn ($a) => (int) $a);

        // Se não houver compras, garantir que o ano atual apareça
        if ($anosDisponiveis->isEmpty()) {
            $anosDisponiveis = collect([(int) date('Y')]);
        }

        $dados = Compra::selectRaw("CAST($monthSql AS INTEGER) as mes, status, count(*) as total")
            ->whereRaw("CAST($yearSql AS INTEGER) = ?", [$ano])
            ->groupBy('mes', 'status')
            ->get()
            ->map(function ($item) {
                $item->mes = (int) $item->mes;

                return $item;
            });

        // Estatísticas de Destinos Populares
        $regiaoId = $request->get('regiao_id');
        $estadoId = $request->get('estado_id');

        $queryDestinos = DB::table('compras')
            ->join('ofertas', 'compras.oferta_id', '=', 'ofertas.id')
            ->join('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->join('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->join('estados', 'cidades.estado_id', '=', 'estados.id')
            ->join('regiaos', 'estados.regiao_id', '=', 'regiaos.id')
            ->select(
                'cidades.nome as cidade',
                'estados.sigla as estado',
                DB::raw('count(compras.id) as total')
            )
            ->where('compras.status', '=', 'ACEITO')
            ->whereRaw("CAST($yearSql AS INTEGER) = ?", [$ano]);

        if ($regiaoId) {
            $queryDestinos->where('regiaos.id', $regiaoId);
        }

        if ($estadoId) {
            $queryDestinos->where('estados.id', $estadoId);
        }

        $destinosPopulares = $queryDestinos
            ->groupBy('cidades.id', 'cidades.nome', 'estados.sigla')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        // Crescimento de Usuários por Ano
        $userYearSql = $isPgsql ? 'EXTRACT(YEAR FROM created_at)' : 'YEAR(created_at)';
        $crescimentoUsuarios = User::selectRaw("CAST($userYearSql AS INTEGER) as ano, count(*) as total")
            ->groupBy('ano')
            ->orderBy('ano', 'asc')
            ->get();

        return Inertia::render('Administracao/Dashboard/Estatisticas', [
            'dados' => $dados,
            'destinosPopulares' => $destinosPopulares,
            'crescimentoUsuarios' => $crescimentoUsuarios,
            'ano' => $ano,
            'anosDisponiveis' => $anosDisponiveis,
            'regioes' => Regiao::all(),
            'estados' => Estado::all(),
            'filtros' => [
                'regiao_id' => $regiaoId,
                'estado_id' => $estadoId,
            ],
        ]);
    }
}
