<?php

namespace App\Http\Controllers\Administracao;

use App\Application\Dashboard\EstatisticasService;
use App\Application\Geografia\LocalizacaoService;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly EstatisticasService $estatisticasService,
        private readonly LocalizacaoService $localizacaoService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Administracao/Dashboard', [
            'stats' => $this->estatisticasService->obterEstatisticasGerais(),
            'activities' => $this->estatisticasService->obterAtividadesRecentes(),
        ]);
    }

    public function estatisticas(Request $request): Response
    {
        $ano = $request->input('ano', date('Y'));
        $regiaoId = $request->input('regiao_id');
        $estadoId = $request->input('estado_id');

        $graficos = $this->estatisticasService->obterDadosGraficos((int)$ano, $regiaoId ? (int)$regiaoId : null, $estadoId ? (int)$estadoId : null);

        return Inertia::render('Administracao/Dashboard/Estatisticas', [
            'dados' => [], // O componente espera DadoCompra[], mas vamos usar os dados do gráfico
            'destinosPopulares' => $graficos->destinosPopulares,
            'crescimentoUsuarios' => $graficos->crescimentoUsuarios,
            'graficos' => $graficos, // Passando o objeto completo para garantir compatibilidade
            'ano' => (int) $ano,
            'anosDisponiveis' => $graficos->anosDisponiveis,
            'regioes' => $this->localizacaoService->listarRegioes(),
            'estados' => $this->localizacaoService->listarEstados(),
            'filtros' => [
                'regiao_id' => $regiaoId,
                'estado_id' => $estadoId,
            ],
        ]);
    }
}
