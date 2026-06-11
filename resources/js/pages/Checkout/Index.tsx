import { Head, usePage } from '@inertiajs/react';
import { Calendar, CreditCard, Package, User } from 'lucide-react';
import React from 'react';
import CustomModal from '@/components/Modal';
import GuestLayout from '@/layouts/GuestLayout';
import { formatarData } from '@/lib/formatarData';
import { useCheckout } from '@/services/comercial/checkoutService';

interface CheckoutProps {
    oferta: App.DTOs.Comercial.CheckoutDTO;
}

export default function Index({ oferta }: CheckoutProps) {
    const { auth, flash } = usePage().props as any;
    const usuario = auth.user;

    const {
        data,
        processing,
        handleSubmit,
        modal,
        setModal,
        valorTotal,
        formatarValor,
    } = useCheckout(oferta);

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

                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-3xl font-bold shadow-xs">
                            🎉 {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-3xl font-bold shadow-xs">
                            ⚠️ {flash.error}
                        </div>
                    )}
                    {flash?.warning && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-3xl font-bold shadow-xs">
                            💡 {flash.warning}
                        </div>
                    )}

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

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all ${
                                    processing
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : 'cursor-pointer bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {processing
                                    ? 'Redirecionando...'
                                    : `Pagar com Mercado Pago`}
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

                                    <div className="mt-4 flex items-center justify-between border-t pt-4 text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-blue-600">
                                            {formatarValor(valorTotal)}
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
