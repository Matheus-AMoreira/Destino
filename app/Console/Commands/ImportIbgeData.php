<?php

namespace App\Console\Commands;

use App\Domain\Geografia\Entities\Regiao;
use App\Domain\Geografia\Entities\Estado;
use App\Domain\Geografia\Entities\Cidade;
use App\Domain\Geografia\Repositories\LocalizacaoRepositoryInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ImportIbgeData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-ibge';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import geographic data from IBGE API';

    /**
     * Execute the console command.
     */
    public function handle(LocalizacaoRepositoryInterface $repo)
    {
        if ($repo->contarCidades() > 0) {
            $this->info('Dados de localização já existem no banco.');

            return;
        }

        $this->info('Iniciando carga hierárquica do IBGE...');

        try {
            // 1. Busca todas as Regiões
            $responseRegioes = Http::get('https://servicodados.ibge.gov.br/api/v1/localidades/regioes');
            $regioesDTO = $responseRegioes->json();

            foreach ($regioesDTO as $rDto) {
                $regiao = new Regiao(
                    id: $rDto['id'],
                    sigla: $rDto['sigla'],
                    nome: $rDto['nome'],
                );

                $repo->salvarRegiao($regiao);

                $this->info("Processando Região: {$regiao->nome}");

                // 2. Busca Estados apenas DESTA região
                $responseEstados = Http::get("https://servicodados.ibge.gov.br/api/v1/localidades/regioes/{$rDto['id']}/estados");
                $estadosDTO = $responseEstados->json();

                foreach ($estadosDTO as $eDto) {
                    $estado = new Estado(
                        id: $eDto['id'],
                        sigla: $eDto['sigla'],
                        nome: $eDto['nome'],
                        regiaoId: $regiao->id,
                    );

                    $repo->salvarEstado($estado);

                    $this->info("  -> Estado: {$estado->nome}");

                    // 3. Busca Cidades apenas DESTE estado
                    $responseCidades = Http::get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/{$eDto['sigla']}/municipios");
                    $cidadesDTO = $responseCidades->json();

                    foreach ($cidadesDTO as $cDto) {
                        $cidade = new Cidade(
                            id: $cDto['id'],
                            nome: $cDto['nome'],
                            estadoId: $estado->id,
                        );

                        $repo->salvarCidade($cidade);
                    }
                }
            }

            $this->info('Carga de dados concluída com sucesso!');

        } catch (\Exception $e) {
            $this->error('Erro ao carregar dados do IBGE: '.$e->getMessage());
            Log::error('Erro ao carregar dados do IBGE: '.$e->getMessage());
        }
    }
}
