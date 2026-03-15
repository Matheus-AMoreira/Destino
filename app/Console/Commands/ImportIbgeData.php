<?php

namespace App\Console\Commands;

use App\Models\Cidade;
use App\Models\Estado;
use App\Models\Regiao;
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
    public function handle()
    {
        if (Cidade::count() > 0) {
            $this->info('Dados de localização já existem no banco.');

            return;
        }

        $this->info('Iniciando carga hierárquica do IBGE...');

        try {
            // 1. Busca todas as Regiões
            $responseRegioes = Http::get('https://servicodados.ibge.gov.br/api/v1/localidades/regioes');
            $regioesDTO = $responseRegioes->json();

            foreach ($regioesDTO as $rDto) {
                $regiao = Regiao::create([
                    'id' => $rDto['id'],
                    'sigla' => $rDto['sigla'],
                    'nome' => $rDto['nome'],
                ]);

                $this->info("Processando Região: {$regiao->nome}");

                // 2. Busca Estados apenas DESTA região
                $responseEstados = Http::get("https://servicodados.ibge.gov.br/api/v1/localidades/regioes/{$rDto['id']}/estados");
                $estadosDTO = $responseEstados->json();

                foreach ($estadosDTO as $eDto) {
                    $estado = Estado::create([
                        'id' => $eDto['id'],
                        'sigla' => $eDto['sigla'],
                        'nome' => $eDto['nome'],
                        'regiao_id' => $regiao->id,
                    ]);

                    $this->info("  -> Estado: {$estado->nome}");

                    // 3. Busca Cidades apenas DESTE estado
                    $responseCidades = Http::get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/{$eDto['sigla']}/municipios");
                    $cidadesDTO = $responseCidades->json();

                    foreach ($cidadesDTO as $cDto) {
                        Cidade::create([
                            'id' => $cDto['id'],
                            'nome' => $cDto['nome'],
                            'estado_id' => $estado->id,
                        ]);
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
