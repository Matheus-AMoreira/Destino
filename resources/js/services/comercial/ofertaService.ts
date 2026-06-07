import { router, useForm } from '@inertiajs/react';
import * as oferta_1 from '@/routes/administracao/oferta';

interface OfertaData {
    id: number;
    preco: string | number;
    inicio: string;
    fim: string;
    disponibilidade: number;
    status: string;
    pacote_id: number;
    hotel_id: number;
    transporte_id: number;
}

export function useOfertaForm(oferta?: OfertaData) {
    const isEdit = !!oferta;

    const { data, setData, post, put, processing, errors } = useForm({
        preco: oferta ? Number(oferta.preco) : 0,
        inicio: oferta ? oferta.inicio.split('T')[0] : '',
        fim: oferta ? oferta.fim.split('T')[0] : '',
        disponibilidade: oferta ? oferta.disponibilidade : 10,
        pacote_id: oferta ? oferta.pacote_id : ('' as string | number),
        hotel_id: oferta ? oferta.hotel_id : ('' as string | number),
        transporte_id: oferta ? oferta.transporte_id : ('' as string | number),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && oferta) {
            put(oferta_1.update({ id: oferta.id }).url);
        } else {
            post(oferta_1.store().url);
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

export function deletarOferta(id: number) {
    if (confirm('Deseja realmente excluir esta oferta?')) {
        router.delete(oferta_1.destroy({ id }).url);
    }
}
