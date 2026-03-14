import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { FaCalendarAlt, FaHistory, FaMapMarkerAlt, FaUser, FaGlobeAmericas } from 'react-icons/fa';
import { TbPlayerTrackNextFilled } from 'react-icons/tb';
import { MdAirplaneTicket } from 'react-icons/md';
import { LuPackageSearch } from 'react-icons/lu';
import { Auth } from '@/types';

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
            fotosDoPacote: {
                fotos: { url: string }[];
            };
            hotel: {
                cidade: {
                    nome: string;
                    estado: { sigla: string };
                };
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
        if (isHistorico) return "bg-gray-100 text-gray-500 border-gray-200";
        switch (status) {
            case 'CONCLUIDO':
                return "bg-green-100 text-green-700 border-green-200";
            case 'PENDENTE':
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case 'CANCELADO':
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <GuestLayout>
            <Head title={isHistorico ? "Histórico de Viagens" : "Minhas Viagens"} />
            
            <div className="min-h-screen bg-gray-50 flex">
                <aside className="w-72 bg-white border-r border-gray-200 hidden lg:block sticky top-0 h-screen overflow-y-auto">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <FaUser size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 leading-tight">Minha Conta</h1>
                                <p className="text-sm text-gray-500 font-medium truncate max-w-[140px]">{auth.user.email}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="p-4 space-y-2 mt-4">
                        <Link
                            href={route('usuario.viagem.listar', { usuario: auth.user.nome, view: 'andamento' })}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-200 ${
                                view === 'andamento'
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                            }`}
                        >
                            <TbPlayerTrackNextFilled size={22} />
                            <span>Próximas Viagens</span>
                        </Link>

                        <Link
                            href={route('usuario.viagem.listar', { usuario: auth.user.nome, view: 'concluidas' })}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-200 ${
                                view === 'concluidas'
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                            }`}
                        >
                            <FaHistory size={20} />
                            <span>Histórico</span>
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-6 lg:p-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4 font-outfit">
                                    <FaGlobeAmericas className="text-blue-600" />
                                    <span>{isHistorico ? "Histórico de Viagens" : "Minhas Viagens"}</span>
                                </h1>
                                <p className="text-gray-500 mt-2 font-medium text-lg">
                                    {isHistorico
                                        ? "Relembre suas aventuras passadas com a Destino"
                                        : "Gerencie suas próximas aventuras inesquecíveis"}
                                </p>
                            </div>

                            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total:</span>
                                <strong className="text-blue-600 text-lg font-black">{compras.length}</strong>
                            </div>
                        </div>

                        {compras.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="text-8xl mb-6 text-gray-200 flex justify-center">
                                    <MdAirplaneTicket />
                                </div>
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                                    {isHistorico ? "Seu histórico está vazio" : "Nenhuma viagem agendada"}
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                                    {isHistorico 
                                        ? "Você ainda não completou nenhuma viagem conosco. Que tal começar agora?"
                                        : "Parece que você ainda não tem planos. Vamos encontrar o destino perfeito?"}
                                </p>
                                {!isHistorico && (
                                    <Link
                                        href={route('buscar')}
                                        className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all"
                                    >
                                        <LuPackageSearch size={22} />
                                        <span>Explorar Destinos</span>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {compras.map((compra) => (
                                    <div
                                        key={compra.id}
                                        className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-50/50 hover:border-blue-100 flex flex-col ${
                                            isHistorico ? "opacity-90 saturate-50" : ""
                                        }`}
                                    >
                                        <div className="h-60 relative overflow-hidden">
                                            <img
                                                src={compra.oferta.pacote.fotosDoPacote?.fotos[0]?.url || '/images/placeholder.jpg'}
                                                alt={compra.oferta.pacote.nome}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                            
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border ${getStatusColor(compra.status)}`}>
                                                    {isHistorico ? "CONCLUÍDA" : compra.status}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-4 left-6">
                                                <div className="flex items-center gap-2 text-white/90 text-sm font-bold bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg">
                                                    <FaMapMarkerAlt className="text-red-400" />
                                                    <span>{compra.oferta.pacote.hotel.cidade.nome}, {compra.oferta.pacote.hotel.cidade.estado.sigla}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors font-outfit truncate">
                                                {compra.oferta.pacote.nome}
                                            </h3>

                                            <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                                                {compra.oferta.pacote.descricao}
                                            </p>

                                            <div className="space-y-4 mt-auto pt-6 border-t border-gray-50">
                                                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <FaCalendarAlt className="text-blue-500" size={18} />
                                                        <span className="text-sm font-bold text-gray-700">
                                                            {formatarData(compra.oferta.inicio)} - {formatarData(compra.oferta.fim)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Preço Total</span>
                                                        <span className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                                                            {formatarValor(compra.valor_final)}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        href={route('usuario.viagem.detalhes', { usuario: auth.user.nome, id: compra.id })}
                                                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                                                    >
                                                        Ver Detalhes
                                                    </Link>
                                                </div>
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
