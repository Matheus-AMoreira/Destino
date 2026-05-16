<?php

namespace App\Application\Comercial;

use App\Domain\Comercial\DTOs\CompraDTO;
use App\Domain\Comercial\DTOs\OfertaDTO;
use App\Domain\Comercial\Repositories\CompraRepositoryInterface;
use App\Enums\OfertaStatus;

class CompraService
{
    public function __construct(
        private readonly CompraRepositoryInterface $repo,
    ) {}

    /** @return CompraDTO[] */
    public function listarViagensDoUsuario(string $userId, string $view = 'andamento'): array
    {
        $rows = $this->repo->listarPorUsuario($userId, $view);
        return array_map(fn($r) => $this->mapRowToDTO($r), $rows);
    }

    public function buscarDetalhesDaViagem(string $id, string $userId): ?array
    {
        return $this->repo->buscarDetalhesCompleto($id, $userId);
    }

    public function listarComprasDoUsuarioParaAdmin(string $userId): array
    {
        return $this->repo->listarPorUsuarioAdmin($userId);
    }

    public function listarComprasDoPacote(int $pacoteId): array
    {
        return $this->repo->listarPorPacote($pacoteId);
    }

    private function mapRowToDTO(object $r): CompraDTO
    {
        $ofertaDTO = null;
        if (isset($r->oferta_id)) {
            $ofertaDTO = new OfertaDTO(
                id: $r->oferta_id,
                preco: (float) $r->oferta_preco,
                inicio: $r->oferta_inicio,
                fim: $r->oferta_fim,
                disponibilidade: $r->oferta_disponibilidade,
                status: OfertaStatus::from($r->oferta_status),
                isAvailable: (bool) $r->oferta_is_available,
                hotel: [
                    'id' => $r->hotel_id,
                    'nome' => $r->hotel_nome,
                    'cidade' => [
                        'nome' => $r->cidade_nome,
                        'estado' => ['sigla' => $r->estado_sigla],
                    ],
                ],
                transporte: null,
                pacote: [
                    'id' => $r->pacote_id,
                    'nome' => $r->pacote_nome,
                    'descricao' => $r->pacote_descricao,
                    'fotos_do_pacote' => [
                        'foto_capa_url' => $r->pf_is_url ? $r->pf_foto_capa : ($r->pf_foto_capa ? \Illuminate\Support\Facades\Storage::url($r->pf_foto_capa) : null),
                        'fotos' => []
                    ],
                ]
            );
        }

        return new CompraDTO(
            id: $r->id,
            dataCompra: $r->data_compra,
            status: $r->status,
            metodo: $r->metodo,
            processadorPagamento: $r->processador_pagamento,
            parcelas: $r->parcelas,
            valorFinal: (float) $r->valor_final,
            oferta: $ofertaDTO,
        );
    }
}
