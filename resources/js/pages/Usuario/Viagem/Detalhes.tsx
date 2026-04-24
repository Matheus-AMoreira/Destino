import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftFromLine,
    BaggageClaim,
    BookSearch,
    CalendarSync,
    Hotel,
    Mail,
    Map,
    Phone,
    Plane,
    Receipt,
} from 'lucide-react';
import react from 'react';
import GuestLayout from '@/layouts/GuestLayout';
import type { Auth } from '@/types';

interface Compra {
    id: string;
    valor_final: number;
    status: string;
    data_compra: string;
    metodo: string;
    processador_pagamento: string;
    parcelas: number;
    oferta: {
        id: number;
        inicio: string;
        fim: string;
        transporte: {
            meio: string;
            empresa: string;
        };
        hotel: {
            nome: string;
            cidade: {
                nome: string;
                estado: { sigla: string };
            };
        };
        pacote: {
            id: number;
            nome: string;
            descricao: string;
            fotos_do_pacote: {
                foto_capa_url: string;
                fotos: { caminho_url: string; nome: string }[];
            };
            tags: { nome: string }[];
        };
    };
}

interface Props {
    compra: Compra;
    auth: Auth;
}

export default function Detalhes({ compra, auth }: Props) {
    const todasFotos = [
        ...(compra.oferta.pacote.fotos_do_pacote?.foto_capa_url
            ? [
                  {
                      caminho_url:
                          compra.oferta.pacote.fotos_do_pacote.foto_capa_url,
                      nome: 'Capa',
                  },
              ]
            : []),
        ...(compra.oferta.pacote.fotos_do_pacote?.fotos || []),
    ].filter(
        (v, i, a) => a.findIndex((t) => t.caminho_url === v.caminho_url) === i,
    );

    const [imagemSelecionada, setImagemSelecionada] = react.useState(
        todasFotos[0]?.caminho_url || '/assets/images/placeholder.jpg',
    );

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };

    const formatarData = (dataIso: string) => {
        return new Date(dataIso).toLocaleDateString('pt-BR');
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ACEITO':
                return 'bg-green-100 text-green-700 font-bold';
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-700 font-bold';
            case 'CANCELADO':
                return 'bg-red-100 text-red-700 font-bold';
            default:
                return 'bg-gray-100 text-gray-700 font-bold';
        }
    };

    return (
        <GuestLayout>
            <Head title={`Viagem: ${compra.oferta.pacote.nome}`} />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="animate-fade-in mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <Link
                                href={route('usuario.viagem.listar', {
                                    user_slug: auth.user.name_slug,
                                })}
                                className="group mb-4 inline-flex items-center text-sm font-black tracking-widest text-blue-600 uppercase transition-colors hover:text-blue-700"
                            >
                                <ArrowLeftFromLine className="mr-4" />
                                Voltar para Minhas Viagens
                            </Link>
                            <h1 className="font-outfit mb-3 text-4xl leading-tight font-black text-gray-900 lg:text-5xl">
                                {compra.oferta.pacote.nome}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`rounded-full border px-4 py-1.5 text-xs tracking-widest uppercase ${getStatusStyle(compra.status)}`}
                                >
                                    Status: {compra.status}
                                </span>
                                <span className="text-sm font-bold text-gray-400">
                                    |
                                </span>
                                <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                                    Reserva #
                                    {compra.id.split('-')[0].toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 rounded-2xl border-2 border-gray-100 bg-white px-8 py-4 text-sm font-black text-gray-900 shadow-sm transition-all hover:border-blue-100 hover:shadow-xl"
                            >
                                <svg
                                    className="h-5 w-5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                Imprimir Voucher
                            </button>
                        </div>
                    </div>

                    <div className="animate-fade-in mb-12">
                        <div className="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl shadow-blue-50">
                            <img
                                src={imagemSelecionada}
                                alt={compra.oferta.pacote.nome}
                                className="h-125 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />
                        </div>

                        {todasFotos.length > 1 && (
                            <div className="mt-6 grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
                                {todasFotos.map((foto, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setImagemSelecionada(
                                                foto.caminho_url,
                                            )
                                        }
                                        className={`aspect-square overflow-hidden rounded-2xl border-4 transition-all duration-300 ${
                                            imagemSelecionada ===
                                            foto.caminho_url
                                                ? 'scale-105 border-blue-600 shadow-lg'
                                                : 'border-white hover:border-blue-200'
                                        }`}
                                    >
                                        <img
                                            src={foto.caminho_url}
                                            alt={foto.nome}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                        <div className="space-y-10 lg:col-span-2">
                            <div className="animate-fade-in rounded-4xl border border-gray-100 bg-white p-10 shadow-xl shadow-blue-50">
                                <h2 className="font-outfit mb-8 flex items-center gap-4 text-2xl font-black text-gray-900">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
                                        <Map />
                                    </div>
                                    Resumo do Itinerário
                                </h2>

                                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                                    <div className="flex items-center space-x-5">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-indigo-50 text-indigo-600">
                                            <Plane />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                Partida
                                            </h3>
                                            <p className="text-xl font-extrabold text-gray-900">
                                                {formatarData(
                                                    compra.oferta.inicio,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-blue-50 text-blue-600">
                                            <CalendarSync />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                Retorno
                                            </h3>
                                            <p className="text-xl font-extrabold text-gray-900">
                                                {formatarData(
                                                    compra.oferta.fim,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-50 text-emerald-600">
                                            <Hotel />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                Hospedagem
                                            </h3>
                                            <p className="text-xl font-extrabold text-gray-900">
                                                {compra.oferta.hotel.nome}
                                            </p>
                                            <p className="text-sm font-bold text-gray-500">
                                                {
                                                    compra.oferta.hotel.cidade
                                                        .nome
                                                }
                                                ,{' '}
                                                {
                                                    compra.oferta.hotel.cidade
                                                        .estado.sigla
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-orange-50 text-orange-600">
                                            <BaggageClaim />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                Transporte
                                            </h3>
                                            <p className="text-xl font-extrabold text-gray-900">
                                                {
                                                    compra.oferta.transporte
                                                        .empresa
                                                }
                                            </p>
                                            <p className="text-sm font-bold text-gray-500">
                                                Modalidade:{' '}
                                                {compra.oferta.transporte.meio}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 border-t border-gray-50 pt-10">
                                    <h3 className="mb-4 text-sm font-black tracking-[0.1em] text-gray-400 uppercase">
                                        Descrição do Pacote
                                    </h3>
                                    <p className="text-lg leading-relaxed font-medium text-gray-600">
                                        {compra.oferta.pacote.descricao}
                                    </p>
                                </div>
                            </div>

                            <div className="animate-fade-in group rounded-[32px] border border-gray-100 bg-white p-10 shadow-xl shadow-blue-50 transition-colors hover:border-blue-100">
                                <h2 className="font-outfit mb-8 flex items-center gap-4 text-2xl font-black text-gray-900">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
                                        <BookSearch />
                                    </div>
                                    Serviços Inclusos
                                </h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {compra.oferta.pacote.tags.map(
                                        (tag, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-5 py-4 transition-colors group-hover:bg-emerald-50"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white font-black text-emerald-500 shadow-sm">
                                                    ✓
                                                </div>
                                                <span className="text-lg font-extrabold text-emerald-800">
                                                    {tag.nome}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="animate-fade-in space-y-10">
                            <div className="group rounded-[32px] border border-gray-100 bg-white p-10 shadow-xl shadow-blue-50 transition-colors hover:border-blue-100">
                                <h2 className="font-outfit mb-8 flex items-center gap-4 text-xl font-black text-gray-900">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
                                        <Receipt />
                                    </div>
                                    Pagamento
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between rounded-2xl bg-gray-50/50 p-4">
                                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                            Data da Compra
                                        </span>
                                        <span className="font-black text-gray-900">
                                            {formatarData(compra.data_compra)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-2xl bg-gray-50/50 p-4">
                                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                            Método
                                        </span>
                                        <span className="font-black tracking-wider text-gray-900 uppercase">
                                            {compra.metodo}
                                        </span>
                                    </div>
                                    {compra.parcelas > 1 && (
                                        <div className="flex items-center justify-between rounded-2xl bg-gray-50/50 p-4">
                                            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                                Parcelas
                                            </span>
                                            <span className="font-black text-gray-900">
                                                {compra.parcelas}x
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-6">
                                        <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                            Investimento Total
                                        </span>
                                        <span className="font-outfit text-4xl font-black tracking-tight text-blue-600">
                                            {formatarValor(compra.valor_final)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-[32px] bg-linear-to-br from-gray-900 to-blue-900 p-10 text-white shadow-2xl">
                                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-32 w-32 rounded-full bg-white/5 transition-transform duration-700 group-hover:scale-150" />

                                <h3 className="font-outfit relative mb-6 text-xl font-black">
                                    Suporte 24h
                                </h3>
                                <div className="relative space-y-6">
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                            <Phone />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                                                Telefone
                                            </p>
                                            <p className="text-lg font-extrabold">
                                                (11) 4002-8922
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                            <Mail />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                                                E-mail
                                            </p>
                                            <p className="font-extrabold">
                                                ajuda@destino.com.br
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={route('contato')}
                                    className="mt-8 block w-full rounded-2xl bg-white py-4 text-center text-sm font-black text-gray-900 shadow-lg shadow-black/20 transition-all hover:bg-blue-50 active:scale-95"
                                >
                                    Precisa de Ajuda?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
