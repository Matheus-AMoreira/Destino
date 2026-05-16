<?php

namespace App\Application\Dashboard;

use App\Domain\Catalogo\Repositories\PacoteRepositoryInterface;
use App\Domain\Comercial\Repositories\CompraRepositoryInterface;
use App\Domain\Comercial\Repositories\OfertaRepositoryInterface;
use App\Domain\Hospedagem\Repositories\HotelRepositoryInterface;
use App\Domain\Hospedagem\Repositories\TransporteRepositoryInterface;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use App\Domain\Shared\Repositories\ActivityLogRepositoryInterface;
use App\Domain\Shared\DTOs\EstatisticasDTO;
use App\Domain\Shared\DTOs\AtividadeRecenteDTO;
use App\Domain\Shared\DTOs\DadosGraficosDTO;

class EstatisticasService
{
    public function __construct(
        private readonly UsuarioRepositoryInterface $usuarioRepo,
        private readonly HotelRepositoryInterface $hotelRepo,
        private readonly TransporteRepositoryInterface $transporteRepo,
        private readonly PacoteRepositoryInterface $pacoteRepo,
        private readonly OfertaRepositoryInterface $ofertaRepo,
        private readonly CompraRepositoryInterface $compraRepo,
        private readonly ActivityLogRepositoryInterface $activityLogRepo,
    ) {}

    public function obterEstatisticasGerais(): EstatisticasDTO
    {
        return new EstatisticasDTO(
            usuarios: $this->usuarioRepo->contarUsuarios(),
            hoteis: $this->hotelRepo->contar(),
            transportes: $this->transporteRepo->contar(),
            pacotes: $this->pacoteRepo->contar(),
            ofertas: $this->ofertaRepo->contar(),
        );
    }

    /** @return AtividadeRecenteDTO[] */
    public function obterAtividadesRecentes(int $limit = 5): array
    {
        $rows = $this->activityLogRepo->listarRecentes($limit);

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
        $comprasMesStatus = $this->compraRepo->comprasPorMesEStatus($anoSelecionado);
        $destinosPopulares = $this->compraRepo->destinosPopulares($anoSelecionado, $regiaoId, $estadoId);
        $crescimentoUsuarios = $this->compraRepo->crescimentoUsuariosPorAno();

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
            anosDisponiveis: $this->compraRepo->anosComCompras(),
        );
    }
}
