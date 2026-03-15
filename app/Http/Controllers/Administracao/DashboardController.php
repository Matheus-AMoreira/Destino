<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\Hotel;
use App\Models\Oferta;
use App\Models\Pacote;
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

        return Inertia::render('Administracao/Dashboard/Estatisticas', [
            'dados' => $dados,
            'ano' => $ano,
            'anosDisponiveis' => $anosDisponiveis,
        ]);
    }
}
