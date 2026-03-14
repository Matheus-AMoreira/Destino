import PacoteCard from '@/components/busca/PacoteCard';
import GuestLayout from '@/layouts/GuestLayout';
import { Pacote } from '@/types/Pacote';
import { router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaMoneyCheckAlt } from 'react-icons/fa';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { PiPackageBold } from 'react-icons/pi';

interface BuscarProps {
    pacotes: Pacote[];
    filters: {
        termo: string;
        precoMax: number;
        page: number;
        size: number;
    };
    paginacao: {
        page: number;
        totalPages: number;
        totalElements: number;
    };
}

export default function Buscar({ pacotes = [], filters, paginacao }: BuscarProps) {
    const [inputTermo, setInputTermo] = useState(filters.termo || '');
    const [inputPreco, setInputPreco] = useState(filters.precoMax || 0);

    useEffect(() => {
        setInputTermo(filters.termo || '');
        setInputPreco(filters.precoMax || 0);
    }, [filters]);

    const handleBuscar = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/buscar', {
            termo: inputTermo,
            precoMax: inputPreco,
            page: 0,
            size: filters.size
        }, { preserveState: true });
    };

    const handleMudarPagina = (novaPagina: number) => {
        router.get('/buscar', { ...filters, page: novaPagina }, { preserveState: true });
    };

    const handleMudarTamanhoPagina = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/buscar', { ...filters, size: Number(e.target.value), page: 0 }, { preserveState: true });
    };

    return (
        <GuestLayout title="Encontre seu destino">
            <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
                {/* Sidebar de Filtros */}
                <aside className="z-10 w-full shrink-0 bg-white p-6 shadow-lg lg:w-80">
                    <div className="mb-8 flex justify-center">
                        <img src="/logo.png" alt="Logo" className="w-32 object-contain" />
                    </div>

                    <form onSubmit={handleBuscar} className="space-y-6">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                <FaMoneyCheckAlt /> Preço Máximo
                            </label>
                            <input
                                type="number"
                                value={inputPreco}
                                onChange={(e) => setInputPreco(Number(e.target.value))}
                                placeholder="Ex: 2000"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                <PiPackageBold /> Pacotes por página
                            </label>
                            <select
                                value={filters.size}
                                onChange={handleMudarTamanhoPagina}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="6">6 itens</option>
                                <option value="12">12 itens</option>
                                <option value="24">24 itens</option>
                                <option value="48">48 itens</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Aplicar Filtros
                        </button>
                    </form>
                </aside>

                {/* Conteúdo Principal */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* Barra de Busca Topo */}
                    <div className="mx-auto mb-8 max-w-4xl">
                        <div className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
                            <MdOutlineTravelExplore />
                            <span>Encontre seu destino</span>
                        </div>
                        <form onSubmit={handleBuscar} className="flex gap-4">
                            <input
                                type="text"
                                value={inputTermo}
                                onChange={(e) => setInputTermo(e.target.value)}
                                placeholder="Buscar por nome do pacote..."
                                className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-[#2071b3] px-8 py-3 font-bold text-white shadow-md transition hover:bg-blue-800"
                            >
                                Buscar
                            </button>
                        </form>
                    </div>

                    {/* Listagem */}
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {paginacao.totalElements} Pacotes encontrados
                            </h2>
                            <span className="text-sm text-gray-500">
                                Página {paginacao.page + 1} de {paginacao.totalPages}
                            </span>
                        </div>

                        {pacotes.length > 0 ? (
                            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {pacotes.map((pacote) => (
                                    <PacoteCard key={pacote.id} pacote={pacote} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                                <p className="text-lg text-gray-500">
                                    Nenhum pacote encontrado com estes filtros.
                                </p>
                            </div>
                        )}

                        {/* Controles de Paginação */}
                        {paginacao.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-6">
                                <button
                                    onClick={() => handleMudarPagina(paginacao.page - 1)}
                                    disabled={paginacao.page === 0}
                                    className="rounded-full bg-white p-3 text-blue-600 shadow transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FaChevronLeft />
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(5, paginacao.totalPages) }, (_, i) => {
                                        let p = i;
                                        if (paginacao.totalPages > 5 && paginacao.page > 2) {
                                            p = paginacao.page - 2 + i;
                                            if (p >= paginacao.totalPages) p = i;
                                        }

                                        if (p < paginacao.totalPages)
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => handleMudarPagina(p)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition ${
                                                        paginacao.page === p
                                                            ? 'bg-[#2071b3] text-white'
                                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {p + 1}
                                                </button>
                                            );
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handleMudarPagina(paginacao.page + 1)}
                                    disabled={paginacao.page === paginacao.totalPages - 1}
                                    className="rounded-full bg-white p-3 text-blue-600 shadow transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                </main>
            </div>
        </GuestLayout>
    );
}
