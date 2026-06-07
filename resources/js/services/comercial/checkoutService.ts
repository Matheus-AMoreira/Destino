import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { ModalData } from '@/components/Modal';
import { process as checkoutProcess } from '@/routes/checkout';

interface CheckoutDTO {
    id: number;
    preco: number;
}

export function useCheckout(oferta: CheckoutDTO) {
    const [metodoPagamento, setMetodoPagamento] = useState('cartao-credito');
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const { data, setData, post, processing } = useForm({
        oferta_id: oferta.id,
        metodo: 'VISTA',
        processador: 'VISA',
        parcelas: 1,
    });

    const valorTotal = oferta.preco || 0;
    const descontoPix = valorTotal * 0.05;
    const valorComDescontoPix = valorTotal - descontoPix;

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };

    const handleMetodoChange = (val: string) => {
        setMetodoPagamento(val);

        if (val === 'pix') {
            setData({
                ...data,
                metodo: 'VISTA',
                processador: 'PIX',
                parcelas: 1,
            });
        } else if (val === 'cartao-credito') {
            setData({
                ...data,
                metodo: data.parcelas > 1 ? 'PARCELADO' : 'VISTA',
                processador: 'MASTERCARD',
            });
        } else {
            setData({
                ...data,
                metodo: 'VISTA',
                processador: 'VISA',
                parcelas: 1,
            });
        }
    };

    const handleParcelasChange = (p: number) => {
        setData({
            ...data,
            parcelas: p,
            metodo: p > 1 ? 'PARCELADO' : 'VISTA',
        });
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
        setData,
        processing,
        metodoPagamento,
        handleMetodoChange,
        handleParcelasChange,
        handleSubmit,
        modal,
        setModal,
        valorTotal,
        descontoPix,
        valorComDescontoPix,
        formatarValor,
    };
}
