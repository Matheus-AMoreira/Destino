import Card from '@/components/landingPage/Card';
import GuestLayout from '@/layouts/GuestLayout';
import { Pacote } from '@/types/Pacote';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineTravelExplore } from 'react-icons/md';

interface IndexProps {
    pacotes: Pacote[];
    totalPaginas: number;
    paginaAtual: number;
}

export default function Index({ pacotes = [], totalPaginas = 0, paginaAtual = 0 }: IndexProps) {
    const [termoBusca, setTermoBusca] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/buscar', { termo: termoBusca });
    };

    const handleProximaPagina = () => {
        if (paginaAtual < totalPaginas - 1) {
            router.get('/', { page: paginaAtual + 1 }, { preserveState: true });
        }
    };

    const handlePaginaAnterior = () => {
        if (paginaAtual > 0) {
            router.get('/', { page: paginaAtual - 1 }, { preserveState: true });
        }
    };

    return (
        <GuestLayout title="O Mundo Todo em Suas Mãos">
            <main className="grow p-4 md:p-8">
                <section className="flex flex-wrap items-center gap-8 pt-4">
                    <div className="mb-4 flex w-full flex-col xl:w-[48%]">
                        <h1 className="mb-4 px-4 pt-3 text-center text-4xl font-extrabold md:text-left lg:text-5xl">
                            O Mundo Todo em Suas Mãos
                        </h1>
                        <div className="p-4 text-lg md:px-8">
                            <p>
                                Planeje a jornada dos seus sonhos sem complicações. Descubra
                                roteiros exclusivos, personalize cada detalhe e acesse pacotes
                                de viagem inesquecíveis.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center px-4 md:justify-start md:px-8">
                            <button
                                onClick={() => router.get('/buscar')}
                                className="rounded-lg bg-[#2071b3] px-8 py-3 text-white shadow-lg transition duration-300 hover:bg-blue-800"
                            >
                                Comece a Planejar
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center w-full xl:mt-0 xl:w-[48%]">
                        <img
                            className="max-w-xgg rounded-3xl w-full shadow-xl"
                            src="/destaque.jpg"
                            alt="Destaque"
                        />
                    </div>
                </section>

                <hr className="my-9 border-t-2 border-sky-300/50" />

                <section className="mt-7">
                    <h2 className="mb-9 text-center text-4xl font-bold">
                        Confira Nossos Pacotes
                    </h2>

                    <div className="mx-auto mb-8 max-w-2xl px-4">
                        <div className="mb-2 flex items-center justify-center space-x-2 text-lg font-semibold text-gray-700">
                            <MdOutlineTravelExplore className="text-xl" />
                            <span>Procurar Viagens</span>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="flex gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={termoBusca}
                                    onChange={(e) => setTermoBusca(e.target.value)}
                                    placeholder="Ex.: Pacote Fernando de Noronha"
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-6 text-lg text-gray-800 shadow-md outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="rounded-xl bg-[#2071b3] px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-800"
                            >
                                Buscar
                            </button>
                        </form>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 px-4 pb-8">
                        {pacotes.length > 0 ? (
                            pacotes.map((pacote) => (
                                <Card
                                    key={pacote.id}
                                    title={pacote.nome}
                                    description={pacote.descricao}
                                    imageUrl={pacote.fotosDoPacote?.fotoDoPacote || 'placeholder'}
                                    detalharHref={`/pacote/${pacote.nome}`}
                                />
                            ))
                        ) : (
                            <p className="w-full text-center text-lg text-gray-500">
                                Nenhum pacote disponível no momento.
                            </p>
                        )}
                    </div>

                    {totalPaginas > 1 && (
                        <div className="mb-8 mt-4 flex items-center justify-center gap-4">
                            <button
                                onClick={handlePaginaAnterior}
                                disabled={paginaAtual === 0}
                                className={`p-3 rounded-full shadow-md transition ${
                                    paginaAtual === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#2071b3] hover:bg-[#2071b3] hover:text-white'
                                }`}
                            >
                                <FaChevronLeft />
                            </button>

                            <span className="text-lg font-medium text-gray-700">
                                Página {paginaAtual + 1} de {totalPaginas}
                            </span>

                            <button
                                onClick={handleProximaPagina}
                                disabled={paginaAtual === totalPaginas - 1}
                                className={`p-3 rounded-full shadow-md transition ${
                                    paginaAtual === totalPaginas - 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#2071b3] hover:bg-[#2071b3] hover:text-white'
                                }`}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </GuestLayout>
    );
}
