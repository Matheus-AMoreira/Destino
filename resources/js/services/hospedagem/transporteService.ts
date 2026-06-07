import { useForm, router } from '@inertiajs/react';
import type React from 'react';
import { store, update, destroy } from '@/routes/administracao/transporte';

interface TransporteData {
    id: number;
    empresa: string;
    meio: string;
    preco: number;
}

export function useTransporteForm(transporte?: TransporteData) {
    const isEdit = !!transporte;

    const { data, setData, post, put, processing, errors } = useForm({
        empresa: transporte?.empresa || '',
        meio: transporte?.meio || '',
        preco: transporte?.preco || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && transporte) {
            put(update({ id: transporte.id }).url);
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

export function deletarTransporte(id: number) {
    if (confirm('Deseja realmente excluir este transporte?')) {
        router.delete(destroy({ id }).url);
    }
}
