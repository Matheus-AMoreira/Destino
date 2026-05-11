import Card from '@/components/landingPage/Card';
import GuestLayout from '@/layouts/GuestLayout';
import { Pacote } from '@/types/Pacote';
import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { MapPinned, ArrowLeft, ChevronRight } from 'lucide-react';
import Image from '@/components/Image';

interface IndexProps {
    pacotes: Pacote[];
    totalPaginas: number;
    paginaAtual: number;
}

// Nomes das imagens do carrossel — ajuste conforme seus arquivos
const IMAGENS_CARROSSEL = ['destaque', 'destaque2', 'destaque3'];

export default function Index({
    pacotes = [],
    totalPaginas = 0,
    paginaAtual = 0,
}: IndexProps) {
    const [termoBusca, setTermoBusca] = useState('');
    const [imagemAtual, setImagemAtual] = useState(0);

    // Avança automaticamente a cada 5 segundos
    useEffect(() => {
        const intervalo = setInterval(() => {
            setImagemAtual((prev) => (prev + 1) % IMAGENS_CARROSSEL.length);
        }, 5000);
        return () => clearInterval(intervalo);
    }, []);

    const handleAnterior = () => {
        setImagemAtual((prev) =>
            prev === 0 ? IMAGENS_CARROSSEL.length - 1 : prev - 1
        );
    };

    const handleProximo = () => {
        setImagemAtual((prev) => (prev + 1) % IMAGENS_CARROSSEL.length);
    };

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
        <GuestLayout title="PAULA VIAGENS E TURISMO">
            <main className="grow p-4 md:p-8">

                {/* ===== SEÇÃO CARROSSEL ===== */}
                <section className="relative min-h-[500px] w-full overflow-hidden bg-gray-900 py-20 px-4 flex items-center justify-center rounded-xl">

                    {/* Imagens do carrossel com fade */}
                    {IMAGENS_CARROSSEL.map((nome, index) => (
                        <div
                            key={nome}
                            className={`absolute inset-0 z-0 transition-opacity duration-700 ${
                                index === imagemAtual ? 'opacity-60' : 'opacity-0'
                            }`}
                        >
                            <Image
                                name={nome}
                                alt={`Imagem de destaque ${index + 1}`}
                                style="h-full w-full object-cover"
                            />
                        </div>
                    ))}

                    {/* Botão anterior */}
                    <button
                        onClick={handleAnterior}
                        className="absolute left-4 z-20 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/70"
                        aria-label="Imagem anterior"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    {/* Conteúdo central */}
                    <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center text-white">
                        <h1 className="mb-6 text-4xl font-extrabold md:text-5xl lg:text-6xl drop-shadow-md">
                            O Mundo Todo em Suas Mãos
                        </h1>
                        <div className="mb-8 max-w-2xl text-lg md:text-xl drop-shadow-sm">
                            <p>
                                Planeje a jornada dos seus sonhos sem
                                complicações. Descubra roteiros exclusivos,
                                personalize cada detalhe e acesse pacotes de
                                viagem inesquecíveis.
                            </p>
                        </div>
                        <button
                            onClick={() => router.get('/buscar')}
                            className="rounded-lg bg-[#2071b3] px-10 py-4 text-lg font-bold text-white shadow-2xl transition duration-300 hover:scale-105 hover:bg-blue-600"
                        >
                            Comece a Planejar
                        </button>

                        {/* Indicadores (bolinhas) */}
                        <div className="mt-6 flex gap-2">
                            {IMAGENS_CARROSSEL.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setImagemAtual(index)}
                                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                                        index === imagemAtual
                                            ? 'bg-white scale-125'
                                            : 'bg-white/40 hover:bg-white/70'
                                    }`}
                                    aria-label={`Ir para imagem ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Botão próximo */}
                    <button
                        onClick={handleProximo}
                        className="absolute right-4 z-20 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/70"
                        aria-label="Próxima imagem"
                    >
                        <ChevronRight size={24} />
                    </button>
                </section>

                {/* O restante do código permanece igual... */}
            </main>
        </GuestLayout>
    );
}