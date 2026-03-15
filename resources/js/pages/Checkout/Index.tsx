import GuestLayout from '@/layouts/GuestLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, CreditCard, Package, User } from 'lucide-react';
import CustomModal, { ModalData } from '@/components/Modal';
import { formatarData } from '@/lib/formatarData';

interface CheckoutProps {
    oferta: any;
}

export default function Index({ oferta }: CheckoutProps) {
    const { auth } = usePage().props as any;
    const usuario = auth.user;

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

    const valorTotal = parseFloat(oferta.preco) || 0;
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

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(route('checkout.processar'), {
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

    return (
        <GuestLayout title="Confirmar Compra">
            <Head title="Checkout" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="mb-4 flex cursor-pointer items-center text-gray-600 hover:text-gray-900"
                        >
                            ← Voltar
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Confirmar Compra
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                    >
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                    <User className="text-xl" />
                                    Seus Dados
                                </h2>
                                <div className="space-y-2">
                                    <p>
                                        <strong>Nome:</strong> {usuario?.nome}{' '}
                                        {usuario?.sobre_nome}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {usuario?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                    <CreditCard className="text-xl" />
                                    Forma de Pagamento
                                </h2>

                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-gray-700">
                                        Selecione como deseja pagar:
                                    </label>
                                    <select
                                        value={metodoPagamento}
                                        onChange={(e) =>
                                            handleMetodoChange(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="cartao-credito">
                                            Cartão de Crédito
                                        </option>
                                        <option value="cartao-debito">
                                            Cartão de Débito
                                        </option>
                                        <option value="pix">PIX</option>
                                    </select>
                                </div>

                                {metodoPagamento === 'cartao-credito' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Parcelas
                                            </label>
                                            <select
                                                value={data.parcelas}
                                                onChange={(e) =>
                                                    handleParcelasChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
                                            >
                                                {[
                                                    1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                    10, 11, 12,
                                                ].map((num) => (
                                                    <option
                                                        key={num}
                                                        value={num}
                                                    >
                                                        {num}x de{' '}
                                                        {formatarValor(
                                                            valorTotal / num,
                                                        )}
                                                        {num > 1
                                                            ? ' sem juros'
                                                            : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {metodoPagamento === 'pix' && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                        <div className="flex items-center">
                                            <span className="mr-3 text-2xl">
                                                🧾
                                            </span>
                                            <div>
                                                <p className="font-semibold text-green-800">
                                                    5% de desconto no PIX!
                                                </p>
                                                <p className="text-sm text-green-600">
                                                    Economize{' '}
                                                    {formatarValor(descontoPix)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all ${
                                    processing
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : 'cursor-pointer bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {processing
                                    ? 'Processando...'
                                    : metodoPagamento === 'pix'
                                      ? `Pagar com PIX - ${formatarValor(valorComDescontoPix)}`
                                      : `Confirmar Compra - ${formatarValor(valorTotal)}`}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                    <Package className="text-3xl text-blue-600" />
                                    Resumo
                                </h2>

                                <div className="mb-4 space-y-3">
                                    <div>
                                        <span className="text-sm font-bold tracking-tight text-gray-500 uppercase">
                                            Pacote
                                        </span>
                                        <p className="font-medium">
                                            {oferta.pacote?.nome}
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Localização:
                                        </span>
                                        <span className="font-medium">
                                            {oferta.hotel?.cidade?.nome} -{' '}
                                            {
                                                oferta.hotel?.cidade?.estado
                                                    ?.sigla
                                            }
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} />
                                            <span>
                                                Embarque:{' '}
                                                {formatarData(oferta.inicio)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} />
                                            <span>
                                                Retorno:{' '}
                                                {formatarData(oferta.fim)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>Valor Original:</span>
                                        <span>{formatarValor(valorTotal)}</span>
                                    </div>

                                    {metodoPagamento === 'pix' && (
                                        <div className="mb-2 flex justify-between text-sm text-green-600">
                                            <span>Desconto PIX:</span>
                                            <span>
                                                -{formatarValor(descontoPix)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-center justify-between border-t pt-4 text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-blue-600">
                                            {metodoPagamento === 'pix'
                                                ? formatarValor(
                                                      valorComDescontoPix,
                                                  )
                                                : formatarValor(valorTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <CustomModal modalData={modal} setModal={setModal} />
        </GuestLayout>
    );
}
