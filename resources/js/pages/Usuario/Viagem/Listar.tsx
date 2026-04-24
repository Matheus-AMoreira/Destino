import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Auth } from '@/types';
import { useMemo } from 'react';
import {
    ArrowRightFromLine,
    Globe,
    History,
    PackageSearch,
    TicketsPlane,
    User,
} from 'lucide-react';
import ViagemCard from '@/components/usuario/ViagemCard';

interface Compra {
    id: string;
    valor_final: number;
    status: string;
    data_compra: string;
    oferta: {
        id: number;
        inicio: string;
        fim: string;
        pacote: {
            id: number;
            nome: string;
            descricao: string;
            fotos_do_pacote: {
                foto_capa_url: string;
                fotos: { caminho_url: string }[];
            };
        };
        hotel: {
            cidade: {
                nome: string;
                estado: { sigla: string };
            };
        };
    };
}

interface Props {
    compras: Compra[];
    view: 'andamento' | 'concluidas';
    auth: Auth;
}

export default function Listar({ compras, view, auth }: Props) {
    const isHistorico = view === 'concluidas';

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };

    const formatarData = (dataIso: string) => {
        return new Date(dataIso).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string) => {
        if (isHistorico) return 'bg-gray-100 text-gray-500 border-gray-200';
        switch (status) {
            case 'ACEITO':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'CANCELADO':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const groupedCompras = useMemo(() => {
        const groups: Record<number, { pacote: any; tickets: Compra[] }> = {};

        compras.forEach((compra) => {
            const pacoteId = compra.oferta.pacote.id;
            if (!groups[pacoteId]) {
                groups[pacoteId] = {
                    pacote: compra.oferta.pacote,
                    tickets: [],
                };
            }
            groups[pacoteId].tickets.push(compra);
        });

        return Object.values(groups).sort((a, b) => {
            const dateA = new Date(a.tickets[0].data_compra).getTime();
            const dateB = new Date(b.tickets[0].data_compra).getTime();
            return dateB - dateA;
        });
    }, [compras]);

    return (
        <GuestLayout>
            <Head
                title={isHistorico ? 'Histórico de Viagens' : 'Minhas Viagens'}
            />

            <div className="flex min-h-screen bg-gray-50">
                <aside className="sticky top-0 hidden h-screen w-72 overflow-y-auto border-r border-gray-200 bg-white lg:block">
                    <div className="border-b border-gray-100 p-8">
                        <div className="mb-2 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                                <User />
                            </div>
                            <div>
                                <h1 className="text-xl leading-tight font-bold text-gray-900">
                                    Minha Conta
                                </h1>
                                <p className="max-w-[140px] truncate text-sm font-medium text-gray-500">
                                    {auth.user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-4 space-y-2 p-4">
                        <Link
                            href={route('usuario.viagem.listar', {
                                user_slug: auth.user.name_slug,
                                view: 'andamento',
                            })}
                            className={`flex w-full items-center gap-3 rounded-2xl px-6 py-4 font-bold transition-all duration-200 ${
                                view === 'andamento'
                                    ? 'translate-x-1 bg-blue-600 text-white shadow-xl shadow-blue-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                        >
                            <ArrowRightFromLine />
                            <span>Próximas Viagens</span>
                        </Link>

                        <Link
                            href={route('usuario.viagem.listar', {
                                user_slug: auth.user.name_slug,
                                view: 'concluidas',
                            })}
                            className={`flex w-full items-center gap-3 rounded-2xl px-6 py-4 font-bold transition-all duration-200 ${
                                view === 'concluidas'
                                    ? 'translate-x-1 bg-blue-600 text-white shadow-xl shadow-blue-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                        >
                            <History />
                            <span>Histórico</span>
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-6 lg:p-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div>
                                <h1 className="font-outfit flex items-center gap-4 text-4xl font-black text-gray-900">
                                    <Globe className="text-blue-600" />
                                    <span>
                                        {isHistorico
                                            ? 'Histórico de Viagens'
                                            : 'Minhas Viagens'}
                                    </span>
                                </h1>
                                <p className="mt-2 text-lg font-medium text-gray-500">
                                    {isHistorico
                                        ? 'Relembre suas aventuras passadas com a Destino'
                                        : 'Gerencie suas próximas aventuras inesquecíveis'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-6 py-3 shadow-sm">
                                <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                                    Total:
                                </span>
                                <strong className="text-lg font-black text-blue-600">
                                    {compras.length}
                                </strong>
                            </div>
                        </div>

                        {compras.length === 0 ? (
                            <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
                                <div className="mb-6 flex justify-center text-8xl text-gray-200">
                                    <TicketsPlane />
                                </div>
                                <h3 className="mb-2 text-2xl font-extrabold text-gray-900">
                                    {isHistorico
                                        ? 'Seu histórico está vazio'
                                        : 'Nenhuma viagem agendada'}
                                </h3>
                                <p className="mx-auto mb-8 max-w-sm font-medium text-gray-500">
                                    {isHistorico
                                        ? 'Você ainda não completou nenhuma viagem conosco. Que tal começar agora?'
                                        : 'Parece que você ainda não tem planos. Vamos encontrar o destino perfeito?'}
                                </p>
                                {!isHistorico && (
                                    <Link
                                        href={route('buscar')}
                                        className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                                    >
                                        <PackageSearch />
                                        <span>Explorar Destinos</span>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8">
                                {groupedCompras.map((grupo) => (
                                    <ViagemCard
                                        key={grupo.pacote.id}
                                        grupo={grupo}
                                        isHistorico={isHistorico}
                                        formatarValor={formatarValor}
                                        formatarData={formatarData}
                                        getStatusColor={getStatusColor}
                                        auth={auth}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </GuestLayout>
    );
}
