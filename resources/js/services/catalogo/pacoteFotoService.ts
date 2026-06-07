import { useForm, router } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { store, update, destroy } from '@/routes/administracao/pacote-foto';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export interface PhotoItem {
    id?: number;
    file: File | null;
    url: string;
    preview: string | null;
    is_url: boolean;
    deleted?: boolean;
}

export interface PacoteFotoData {
    id: number;
    nome: string;
    foto_capa: string | null;
    storage_type: 'local' | 'cloud' | 'url';
    is_url: boolean;
    itens: { id: number; caminho_url: string; is_url: boolean }[];
}

export function usePacoteFotoForm(pacoteFoto?: PacoteFotoData) {
    const isEdit = !!pacoteFoto;

    const { data, setData, post, processing, errors } = useForm({
        nome: pacoteFoto?.nome || '',
        foto_capa_file: null as File | null,
        foto_capa_url: pacoteFoto?.is_url ? pacoteFoto?.foto_capa || '' : '',
        is_url_capa: pacoteFoto?.is_url || false,
        itens: (pacoteFoto?.itens || []).map((item) => ({
            id: item.id,
            file: null,
            url: item.is_url ? item.caminho_url : '',
            preview: item.caminho_url,
            is_url: item.is_url,
        })) as PhotoItem[],
    });

    const [capaPreview, setCapaPreview] = useState<string | null>(
        pacoteFoto?.foto_capa || null,
    );

    const handleCapaFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            alert('O arquivo é muito grande! O limite é 20MB.');
            return;
        }
        setData((prev) => ({
            ...prev,
            foto_capa_file: file,
            foto_capa_url: '',
            is_url_capa: false,
        }));
        setCapaPreview(URL.createObjectURL(file));
    };

    const handleCapaUrl = (url: string) => {
        setData((prev) => ({
            ...prev,
            foto_capa_url: url,
            foto_capa_file: null,
            is_url_capa: true,
        }));
        setCapaPreview(url);
    };

    const addAuxiliaryPhoto = () => {
        setData('itens', [
            ...data.itens,
            { file: null, url: '', preview: null, is_url: false },
        ]);
    };

    const removeAuxiliaryPhoto = (index: number) => {
        const newItens = [...data.itens];
        const item = newItens[index];

        if (item.id) {
            newItens[index] = { ...item, deleted: true };
        } else {
            newItens.splice(index, 1);
        }
        setData('itens', newItens);
    };

    const updateAuxiliaryPhoto = (
        index: number,
        updates: Partial<PhotoItem>,
    ) => {
        const newItens = [...data.itens];
        newItens[index] = { ...newItens[index], ...updates };
        setData('itens', newItens);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && pacoteFoto) {
            post(update({ id: pacoteFoto.id }).url);
        } else {
            post(store().url);
        }
    };

    return {
        data,
        setData,
        processing,
        errors,
        capaPreview,
        setCapaPreview,
        handleCapaFile,
        handleCapaUrl,
        addAuxiliaryPhoto,
        removeAuxiliaryPhoto,
        updateAuxiliaryPhoto,
        handleSubmit,
    };
}

export function deletarPacoteFoto(id: number) {
    if (confirm('Deseja realmente excluir este pacote de fotos?')) {
        router.delete(destroy({ id }).url);
    }
}
