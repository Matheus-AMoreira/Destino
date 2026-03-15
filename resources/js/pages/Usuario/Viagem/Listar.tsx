import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Auth } from '@/types';
import { useMemo } from 'react';
import {
    ArrowRightFromLine,
    CalendarDays,
    Globe,
    History,
    MapPin,
    PackageSearch,
    Ticket,
    TicketsPlane,
    User,
} from 'lucide-react';

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
                fotos: { url: string }[];
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
            // Sort groups by the newest ticket date
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
                                user: auth.user.id,
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
                                user: auth.user.id,
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
                    <div className="mx-auto max-w-6xl">
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
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {groupedCompras.map((grupo) => (
                                    <div
                                        key={grupo.pacote.id}
                                        className={`group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/50 ${
                                            isHistorico
                                                ? 'opacity-90 saturate-50'
                                                : ''
                                        }`}
                                    >
                                        <div className="relative h-60 overflow-hidden">
                                            <img
                                                src={
                                                    grupo.pacote.fotos_do_pacote
                                                        ?.fotos[0]?.url ||
                                                    '/images/placeholder.jpg'
                                                }
                                                alt={grupo.pacote.nome}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                                            <div className="absolute top-4 left-4 flex gap-2">
                                                {grupo.tickets.length > 1 && (
                                                    <span className="flex items-center gap-2 rounded-xl bg-blue-600/90 px-3 py-1.5 text-xs font-black text-white shadow-lg backdrop-blur-md">
                                                        <Ticket />
                                                        {
                                                            grupo.tickets.length
                                                        }{' '}
                                                        PASSAGENS
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute bottom-4 left-6">
                                                <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-1 text-sm font-bold text-white/90 backdrop-blur-md">
                                                    <MapPin className="text-red-400" />
                                                    <span>
                                                        {
                                                            grupo.tickets[0]
                                                                .oferta.hotel
                                                                .cidade.nome
                                                        }
                                                        ,{' '}
                                                        {
                                                            grupo.tickets[0]
                                                                .oferta.hotel
                                                                .cidade.estado
                                                                .sigla
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-1 flex-col p-8">
                                            <h3 className="font-outfit mb-3 truncate text-2xl font-black text-gray-900 transition-colors group-hover:text-blue-600">
                                                {grupo.pacote.nome}
                                            </h3>

                                            <p className="mb-6 line-clamp-2 text-sm leading-relaxed font-medium text-gray-500">
                                                {grupo.pacote.descricao}
                                            </p>

                                            <div className="mt-auto space-y-4 border-t border-gray-100 pt-6">
                                                {grupo.tickets.map(
                                                    (compra, idx) => (
                                                        <div
                                                            key={compra.id}
                                                            className={`${idx > 0 ? 'mt-4 border-t border-gray-50 pt-4' : ''}`}
                                                        >
                                                            <div className="mb-4 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className={`rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase ${getStatusColor(compra.status)}`}
                                                                    >
                                                                        {isHistorico
                                                                            ? 'CONCLUÍDA'
                                                                            : compra.status}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                                        Ticket #
                                                                        {
                                                                            compra.id.split(
                                                                                '-',
                                                                            )[0]
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="block text-xs font-black text-gray-900">
                                                                        {formatarValor(
                                                                            compra.valor_final,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="mb-4 flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-4 transition-colors group-hover:border-blue-100/50 group-hover:bg-blue-50/50">
                                                                <div className="flex items-center gap-3">
                                                                    <CalendarDays
                                                                        className="text-blue-500"
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                    <span className="text-sm font-bold text-gray-700">
                                                                        {formatarData(
                                                                            compra
                                                                                .oferta
                                                                                .inicio,
                                                                        )}{' '}
                                                                        -{' '}
                                                                        {formatarData(
                                                                            compra
                                                                                .oferta
                                                                                .fim,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <Link
                                                                    href={route(
                                                                        'usuario.viagem.detalhes',
                                                                        {
                                                                            user: auth
                                                                                .user
                                                                                .id,
                                                                            compra: compra.id,
                                                                        },
                                                                    )}
                                                                    className="flex items-center gap-1 text-sm font-black text-blue-600 transition-colors hover:text-blue-700"
                                                                >
                                                                    Detalhes
                                                                    <ArrowRightFromLine />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </GuestLayout>
    );
}
