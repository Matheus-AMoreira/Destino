import { useForm, router } from '@inertiajs/react';
import type React from 'react';
import { store, update, destroy, compras } from '@/routes/administracao/pacote';
import { http } from '../_http';

interface PacoteData {
    id: number;
    nome: string;
    descricao: string;
    funcionario_id: string;
    pacote_foto_id: number | null;
    tags_string?: string;
}

export interface CompraRelatorio {
    id: string;
    data_compra: string;
    status: string;
    valor_final: number;
    user: {
        nome: string;
        sobre_nome: string;
        email: string;
    };
    oferta: {
        inicio: string;
        fim: string;
        hotel: {
            cidade: {
                nome: string;
            };
        };
    };
}

export async function obterVendas(
    pacoteId: number,
): Promise<CompraRelatorio[]> {
    return http.get<CompraRelatorio[]>(compras({ pacote: pacoteId }).url);
}

export function usePacoteForm(pacote?: PacoteData) {
    const isEdit = !!pacote;

    const { data, setData, post, put, processing, errors } = useForm({
        nome: pacote?.nome || '',
        descricao: pacote?.descricao || '',
        tags: pacote?.tags_string || '',
        funcionario_id: pacote?.funcionario_id || '',
        pacote_foto_id: pacote?.pacote_foto_id?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && pacote) {
            put(update({ id: pacote.id }).url);
        } else {
            post(store().url);
        }
    };

    return {
        data,
        setData,
        processing,
        errors,
        handleSubmit,
    };
}

export function deletarPacote(id: number) {
    if (confirm('Deseja realmente excluir este pacote?')) {
        router.delete(destroy({ id }).url);
    }
}
