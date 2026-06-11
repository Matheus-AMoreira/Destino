<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Catalogo\Pacote;
use App\Models\Identidade\Usuario;
use App\Models\Comercial\Oferta;
use App\Models\Comercial\Compra;
use App\Models\Hospedagem\Hotel;
use App\Models\Hospedagem\Transporte;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class ComprasSimulationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('pt_BR');
        
        $pacotes = Pacote::all();
        $usuarios = Usuario::all();
        $hoteis = Hotel::all();
        $transportes = Transporte::all();

        if ($pacotes->isEmpty() || $usuarios->isEmpty()) {
            $this->command->warn('Pacotes ou Usuários não encontrados no banco de dados. Por favor, crie-os primeiro antes de rodar esta simulação.');
            return;
        }

        $startDate = Carbon::create(2020, 1, 1);
        // Ano atual no contexto da solicitação é 2026
        $endDate = Carbon::create(date('Y'), 12, 31);

        // Desabilita restrições e disparos de eventos (para passar por cima de certas validações como envio de email, webhooks, ou constraints de foreign key ausentes)
        Schema::disableForeignKeyConstraints();
        Compra::flushEventListeners();
        Oferta::flushEventListeners();

        $this->command->info('Iniciando a criação de 100 ofertas e compras simuladas para dar a impressão de uso...');

        for ($i = 0; $i < 100; $i++) {
            $pacote = $pacotes->random();
            $usuario = $usuarios->random();
            
            // Datas da oferta entre 2020 e fim do ano
            $inicio = Carbon::createFromTimestamp(rand($startDate->timestamp, $endDate->timestamp));
            // Tempo da viagem variando
            $fim = (clone $inicio)->addDays(rand(3, 15));
            
            // Valores variáveis para a oferta
            $preco = rand(500, 5000) + (rand(0, 99) / 100);

            $statusOferta = $fim->isPast() ? 'FINALIZADA' : 'ATIVO';

            // Criar Oferta baseada no pacote
            $oferta = Oferta::create([
                'preco' => $preco,
                'inicio' => $inicio->format('Y-m-d H:i:s'),
                'fim' => $fim->format('Y-m-d H:i:s'),
                'disponibilidade' => rand(0, 50),
                'status' => $statusOferta,
                'is_available' => $fim->isFuture(),
                'pacote_id' => $pacote->id,
                'hotel_id' => $hoteis->isNotEmpty() ? $hoteis->random()->id : null,
                'transporte_id' => $transportes->isNotEmpty() ? $transportes->random()->id : null,
            ]);

            // Criar a Compra, simulando uma data anterior ao início da oferta
            $dataCompra = (clone $inicio)->subDays(rand(1, 30));

            Compra::create([
                'data_compra' => $dataCompra->format('Y-m-d H:i:s'),
                'status' => 'PAGO', 
                'metodo' => $faker->randomElement(['PIX', 'CARTAO_CREDITO', 'BOLETO']),
                'processador_pagamento' => 'MERCADO_PAGO',
                'parcelas' => rand(1, 12),
                'valor_final' => $preco,
                'user_id' => $usuario->id,
                'oferta_id' => $oferta->id,
                'mp_preference_id' => Str::random(10),
                'mp_payment_id' => Str::random(10),
            ]);
        }

        // Reabilita as constraints
        Schema::enableForeignKeyConstraints();

        $this->command->info('100 compras e ofertas simuladas com sucesso! O sistema agora parece estar operando há muito tempo.');
    }
}
