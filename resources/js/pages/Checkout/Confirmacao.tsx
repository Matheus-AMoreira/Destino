import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';

interface ConfirmacaoProps {
    compra: any;
}

export default function Confirmacao({ compra }: ConfirmacaoProps) {
    const { auth } = usePage().props as any;
    const usuario = auth.user;

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };

    return (
        <GuestLayout title="Reserva Confirmada">
            <Head title="Confirmação de Reserva" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
                <div className="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <svg
                                className="h-10 w-10 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <h1 className="mb-2 text-2xl font-bold text-gray-900">
                            Pagamento Confirmado!
                        </h1>

                        <p className="mb-6 text-gray-600">
                            Sua viagem foi reservada com sucesso. Em breve você
                            receberá um email com todos os detalhes.
                        </p>

                        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Número do Pedido:
                                    </span>
                                    <span className="font-semibold">
                                        #{compra.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Pacote:
                                    </span>
                                    <span className="text-right font-semibold">
                                        {compra.oferta?.pacote?.nome}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Valor Pago:
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        {formatarValor(
                                            Number(compra.valor_final),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Status:
                                    </span>
                                    <span className="font-semibold">
                                        {compra.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Data da Compra:
                                    </span>
                                    <span className="font-semibold">
                                        {new Date(
                                            compra.data_compra,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={route('usuario.viagem.listar', {
                                user: usuario?.id,
                            })}
                            className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Ver Minhas Viagens
                        </Link>

                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                onClick={() => window.print()}
                                className="flex cursor-pointer items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                                <svg
                                    className="mr-1 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                Imprimir
                            </button>

                            <Link
                                href="/contato"
                                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                                <svg
                                    className="mr-1 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Ajuda
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Obrigado por escolher a Destino! 🌴
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
