import { useEffect, useState } from 'react';
import type {
    CreateAvaliacaoPayload,
    UpdateAvaliacaoPayload,
} from '../../types/Avaliacao';
import { http } from '../_http';

const AVALIACOES_BASE_URL = '/api/avaliacoes';

export async function obterAvaliacoesPacote(
    pacoteId: number,
): Promise<App.DTOs.Comercial.AvaliacaoPacoteDTO> {
    return http.get(`/api/pacotes/${pacoteId}/avaliacoes`);
}

export async function criarAvaliacao(
    payload: CreateAvaliacaoPayload,
): Promise<any> {
    return http.post(AVALIACOES_BASE_URL, payload);
}

export async function atualizarAvaliacao(
    id: number,
    payload: UpdateAvaliacaoPayload,
): Promise<any> {
    return http.put(`${AVALIACOES_BASE_URL}/${id}`, payload);
}

export async function deletarAvaliacao(id: number): Promise<void> {
    return http.delete(`${AVALIACOES_BASE_URL}/${id}`);
}

export async function verificarPermissao(
    compraId: string,
): Promise<{ permitido: boolean }> {
    return http.get(`${AVALIACOES_BASE_URL}/permissao/${compraId}`);
}

export function useAvaliacoes(
    pacoteId: number,
    onAvaliacaoDeleted?: () => void,
) {
    const [avaliacoes, setAvaliacoes] =
        useState<App.DTOs.Comercial.AvaliacaoPacoteDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const carregarAvaliacoes = async () => {
        try {
            setLoading(true);
            const data = await obterAvaliacoesPacote(pacoteId);
            setAvaliacoes(data);
            setErro(null);
        } catch (err) {
            setErro(
                err instanceof Error
                    ? err.message
                    : 'Erro ao carregar avaliações',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarAvaliacoes();
    }, [pacoteId]);

    const handleDeletar = async (avaliacaoId: number) => {
        try {
            await deletarAvaliacao(avaliacaoId);
            await carregarAvaliacoes();
            onAvaliacaoDeleted?.();
        } catch (err) {
            setErro(
                err instanceof Error
                    ? err.message
                    : 'Erro ao deletar avaliação',
            );
        }
    };

    return {
        avaliacoes,
        loading,
        erro,
        carregarAvaliacoes,
        handleDeletar,
    };
}

export function useAvaliacaoForm({
    pacoteId,
    compraId,
    avaliacaoExistente,
    onSuccess,
}: {
    pacoteId: number;
    compraId: string;
    avaliacaoExistente?: App.DTOs.Comercial.AvaliacaoDTO;
    onSuccess?: () => void;
}) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const enviarAvaliacao = async (nota: number, comentario: string) => {
        try {
            setSubmitting(true);
            setError(null);
            if (avaliacaoExistente) {
                await atualizarAvaliacao(avaliacaoExistente.id, {
                    nota,
                    comentario: comentario || undefined,
                });
            } else {
                await criarAvaliacao({
                    pacote_id: pacoteId,
                    compra_id: compraId,
                    nota,
                    comentario: comentario || undefined,
                });
            }
            onSuccess?.();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Erro ao salvar avaliação',
            );
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    return {
        enviarAvaliacao,
        submitting,
        error,
    };
}
