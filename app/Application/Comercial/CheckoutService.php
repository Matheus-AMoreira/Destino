<?php

namespace App\Application\Comercial;

use App\Domain\Comercial\DTOs\CheckoutDTO;
use App\Domain\Comercial\Repositories\CompraRepositoryInterface;
use App\Domain\Comercial\Repositories\OfertaRepositoryInterface;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use App\Enums\Metodo;
use App\Enums\Processador;
use App\Enums\StatusCompra;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class CheckoutService
{
    public function __construct(
        private readonly OfertaRepositoryInterface $ofertaRepo,
        private readonly CompraRepositoryInterface $compraRepo,
        private readonly UsuarioRepositoryInterface $usuarioRepo,
    ) {}

    public function buscarDetalhes(int $ofertaId): ?CheckoutDTO
    {
        // Neste caso específico, faremos a query direta para pegar todos os relacionamentos
        $row = DB::table('ofertas')
            ->where('ofertas.id', $ofertaId)
            ->where('ofertas.is_available', true)
            ->leftJoin('pacotes', 'ofertas.pacote_id', '=', 'pacotes.id')
            ->leftJoin('pacote_fotos', 'pacotes.pacote_foto_id', '=', 'pacote_fotos.id')
            ->leftJoin('hotels', 'ofertas.hotel_id', '=', 'hotels.id')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->select(
                'ofertas.*',
                'pacotes.nome as pacote_nome',
                'pacote_fotos.foto_capa as pf_foto_capa',
                'pacote_fotos.is_url as pf_is_url',
                'hotels.nome as hotel_nome',
                'cidades.nome as cidade_nome',
                'estados.sigla as estado_sigla'
            )
            ->first();

        if (!$row) return null;

        $fotoCapa = null;
        if (isset($row->pf_foto_capa)) {
            $fotoCapa = $row->pf_is_url ? $row->pf_foto_capa : Storage::url($row->pf_foto_capa);
        }

        return new CheckoutDTO(
            ofertaId: $row->id,
            preco: (float) $row->preco,
            inicio: $row->inicio,
            fim: $row->fim,
            disponibilidade: $row->disponibilidade,
            pacoteNome: $row->pacote_nome,
            fotoCapa: $fotoCapa,
            hotelNome: $row->hotel_nome,
            cidadeNome: $row->cidade_nome,
            estadoSigla: $row->estado_sigla,
        );
    }

    public function processarCompra(string $userId, int $ofertaId, array $dadosPagamento): string
    {
        $user = $this->usuarioRepo->buscarPorId($userId);
        if (!$user) throw new InvalidArgumentException("Usuário não encontrado.");

        $cpf = $this->usuarioRepo->buscarCpfDescriptografado($userId);
        if (empty($cpf) || empty($user->telefone)) {
            throw new InvalidArgumentException("Perfil incompleto. CPF e telefone são obrigatórios para a compra.");
        }

        return DB::transaction(function () use ($userId, $ofertaId, $dadosPagamento) {
            $oferta = $this->ofertaRepo->buscarPorId($ofertaId);
            if (!$oferta || !$oferta->isAvailable || $oferta->disponibilidade < 1) {
                throw new InvalidArgumentException("Esta oferta não está mais disponível.");
            }

            // Decrementa a disponibilidade
            $this->ofertaRepo->atualizar($ofertaId, [
                'disponibilidade' => $oferta->disponibilidade - 1,
            ]);

            // Determinar o processador baseado no payload simulado
            $processador = Processador::tryFrom($dadosPagamento['processador'] ?? '') ?? Processador::PIX;

            $idCompra = $this->compraRepo->criar([
                'data_compra' => now(),
                'status' => StatusCompra::ACEITO->value, // Simulado aceito direto
                'metodo' => $dadosPagamento['metodo'] ?? Metodo::VISTA->value,
                'processador_pagamento' => $processador->value,
                'parcelas' => $dadosPagamento['parcelas'] ?? 1,
                'valor_final' => $oferta->preco,
                'user_id' => $userId,
                'oferta_id' => $ofertaId,
            ]);

            return $idCompra;
        });
    }
}
