import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { FaHotel, FaMapMarkedAlt, FaMoneyCheckAlt, FaSearchLocation } from 'react-icons/fa';
import { FaTruckPlane } from 'react-icons/fa6';
import { MdEmail, MdOutlineAirplanemodeActive } from 'react-icons/md';
import { TbCalendarRepeat, TbCalendarUp } from 'react-icons/tb';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { Auth } from '@/types';

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
            fotosDoPacote: {
                fotos: { url: string; nome: string }[];
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
    const [imagemSelecionada, setImagemSelecionada] = useState(compra.oferta.pacote.fotosDoPacote?.fotos[0]?.url || '/images/placeholder.jpg');

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
            case 'CONCLUIDO':
                return "bg-green-100 text-green-700 font-bold";
            case 'PENDENTE':
                return "bg-yellow-100 text-yellow-700 font-bold";
            case 'CANCELADO':
                return "bg-red-100 text-red-700 font-bold";
            default:
                return "bg-gray-100 text-gray-700 font-bold";
        }
    };

    return (
        <GuestLayout>
            <Head title={`Viagem: ${compra.oferta.pacote.nome}`} />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in">
                        <div>
                            <Link
                                href={route('usuario.viagem.listar', { usuario: auth.user.nome })}
                                className="inline-flex items-center text-sm font-black text-blue-600 hover:text-blue-700 mb-4 uppercase tracking-widest transition-colors group"
                            >
                                <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Voltar para Minhas Viagens
                            </Link>
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 font-outfit leading-tight mb-3">
                                {compra.oferta.pacote.nome}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border ${getStatusStyle(compra.status)}`}>
                                    Status: {compra.status}
                                </span>
                                <span className="text-gray-400 font-bold text-sm">|</span>
                                <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Reserva #{compra.id.split('-')[0].toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.print()}
                                className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-sm shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Imprimir Voucher
                            </button>
                        </div>
                    </div>

                    <div className="mb-12 animate-fade-in">
                        <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-50 border border-gray-100 overflow-hidden relative group">
                            <img
                                src={imagemSelecionada}
                                alt={compra.oferta.pacote.nome}
                                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                        </div>

                        {compra.oferta.pacote.fotosDoPacote?.fotos.length > 1 && (
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-6">
                                {compra.oferta.pacote.fotosDoPacote.fotos.map((foto, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setImagemSelecionada(foto.url)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                                            imagemSelecionada === foto.url
                                                ? "border-blue-600 shadow-lg scale-105"
                                                : "border-white hover:border-blue-200"
                                        }`}
                                    >
                                        <img
                                            src={foto.url}
                                            alt={foto.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="bg-white rounded-[32px] shadow-xl shadow-blue-50 border border-gray-100 p-10 animate-fade-in">
                                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4 font-outfit">
                                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                        <FaMapMarkedAlt size={22} />
                                    </div>
                                    Resumo do Itinerário
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="flex items-center space-x-5">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-[20px] flex items-center justify-center text-indigo-600">
                                            <MdOutlineAirplanemodeActive size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                                Partida
                                            </h3>
                                            <p className="font-extrabold text-gray-900 text-xl">
                                                {formatarData(compra.oferta.inicio)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="w-14 h-14 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600">
                                            <TbCalendarRepeat size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                                Retorno
                                            </h3>
                                            <p className="font-extrabold text-gray-900 text-xl">
                                                {formatarData(compra.oferta.fim)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-600">
                                            <FaHotel size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                                Hospedagem
                                            </h3>
                                            <p className="font-extrabold text-gray-900 text-xl">
                                                {compra.oferta.hotel.nome}
                                            </p>
                                            <p className="text-sm font-bold text-gray-500">
                                                {compra.oferta.hotel.cidade.nome}, {compra.oferta.hotel.cidade.estado.sigla}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="w-14 h-14 bg-orange-50 rounded-[20px] flex items-center justify-center text-orange-600">
                                            <FaTruckPlane size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                                Transporte
                                            </h3>
                                            <p className="font-extrabold text-gray-900 text-xl">
                                                {compra.oferta.transporte.empresa}
                                            </p>
                                            <p className="text-sm font-bold text-gray-500">
                                                Modalidade: {compra.oferta.transporte.meio}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-10 pt-10 border-t border-gray-50">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] mb-4">Descrição do Pacote</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        {compra.oferta.pacote.descricao}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[32px] shadow-xl shadow-blue-50 border border-gray-100 p-10 animate-fade-in group hover:border-blue-100 transition-colors">
                                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4 font-outfit">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                                        <FaSearchLocation size={22} />
                                    </div>
                                    Serviços Inclusos
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {compra.oferta.pacote.tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3 bg-emerald-50/50 px-5 py-4 rounded-2xl border border-emerald-100 group-hover:bg-emerald-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-500 font-black shadow-sm">
                                                ✓
                                            </div>
                                            <span className="font-extrabold text-emerald-800 text-lg">{tag.nome}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10 animate-fade-in">
                            <div className="bg-white rounded-[32px] shadow-xl shadow-blue-50 border border-gray-100 p-10 group hover:border-blue-100 transition-colors">
                                <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-4 font-outfit">
                                    <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                        <FaMoneyCheckAlt size={18} />
                                    </div>
                                    Pagamento
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Data da Compra</span>
                                        <span className="text-gray-900 font-black">{formatarData(compra.data_compra)}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Método</span>
                                        <span className="text-gray-900 font-black uppercase tracking-wider">{compra.metodo}</span>
                                    </div>
                                    {compra.parcelas > 1 && (
                                        <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                                            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Parcelas</span>
                                            <span className="text-gray-900 font-black">{compra.parcelas}x</span>
                                        </div>
                                    )}
                                    <div className="pt-6 border-t border-gray-100 flex flex-col gap-2">
                                        <span className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Investimento Total</span>
                                        <span className="text-4xl font-black text-blue-600 font-outfit tracking-tight">
                                            {formatarValor(compra.valor_final)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-linear-to-br from-gray-900 to-blue-900 rounded-[32px] shadow-2xl p-10 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                                
                                <h3 className="text-xl font-black mb-6 font-outfit relative">Suporte 24h</h3>
                                <div className="space-y-6 relative">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <BsFillTelephoneFill />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Telefone</p>
                                            <p className="font-extrabold text-lg">(11) 4002-8922</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <MdEmail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">E-mail</p>
                                            <p className="font-extrabold">ajuda@destino.com.br</p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={route('contato')}
                                    className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-sm mt-8 block text-center hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-black/20"
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
