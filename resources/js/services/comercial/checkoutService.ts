import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { ModalData } from '@/components/Modal';
import { process as checkoutProcess } from '@/routes/checkout';

interface CheckoutDTO {
    id: number;
    preco: number;
}

export function useCheckout(oferta: CheckoutDTO) {
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const { data, post, processing } = useForm({
        oferta_id: oferta.id,
        metodo: 'VISTA',
        processador: 'MERCADOPAGO',
        parcelas: 1,
    });

    const valorTotal = oferta.preco || 0;

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(checkoutProcess({ ofertaId: oferta.id }).url, {
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem:
                        Object.values(err).join('\n') ||
                        'Erro ao processar compra.',
                    url: null,
                });
            },
        });
    };

    return {
        data,
        processing,
        handleSubmit,
        modal,
        setModal,
        valorTotal,
        formatarValor,
    };
}
