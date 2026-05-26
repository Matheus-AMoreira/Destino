import type { Avaliacao, AvaliacaoPacote, CreateAvaliacaoPayload, UpdateAvaliacaoPayload } from '../types/Avaliacao';

const BASE_URL = '/api/avaliacoes';

export const avaliacaoApi = {
    async obterAvaliacoesPacote(pacoteId: number): Promise<AvaliacaoPacote> {
        const response = await fetch(`/api/pacotes/${pacoteId}/avaliacoes`);
        if (!response.ok) {
            throw new Error('Erro ao obter avaliações');
        }
        return response.json();
    },

    async criarAvaliacao(payload: CreateAvaliacaoPayload): Promise<AvaliacaoPacote> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar avaliação');
        }
        return response.json();
    },

    async atualizarAvaliacao(id: number, payload: UpdateAvaliacaoPayload): Promise<Avaliacao> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar avaliação');
        }
        return response.json();
    },

    async deletarAvaliacao(id: number): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao deletar avaliação');
        }
    },

    async verificarPermissao(compraId: string): Promise<{ permitido: boolean }> {
        const response = await fetch(`${BASE_URL}/permissao/${compraId}`);
        if (!response.ok) {
            throw new Error('Erro ao verificar permissão');
        }
        return response.json();
    },
};
