import GuestLayout from '@/layouts/GuestLayout';
import { formatarData } from '@/lib/formatarData';
import { Pacote } from '@/types/Pacote';
import { Link, router } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CreditCard,
    Plane,
    TicketsPlane,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DetalhesProps {
    nome: string;
    pacote: Pacote | null;
}

export default function Detalhes({ nome, pacote }: DetalhesProps) {
    const [imagemSelecionada, setImagemSelecionada] = useState<string>('');
    const [ofertaSelecionadaId, setOfertaSelecionadaId] = useState<
        number | null
    >(null);
    const [modalAberto, setModalAberto] = useState(false);
    const numeroPessoas = 1;

    useEffect(() => {
        if (pacote?.fotos_do_pacote?.foto_capa) {
            setImagemSelecionada(pacote.fotos_do_pacote.foto_capa);
        }
        if (
            pacote?.ofertas &&
            pacote.ofertas.length > 0 &&
            !ofertaSelecionadaId
        ) {
            setOfertaSelecionadaId(pacote.ofertas[0].id);
        }
    }, [pacote]);

    const ofertaAtual =
        pacote?.ofertas?.find((o) => o.id === ofertaSelecionadaId) ||
        pacote?.ofertas?.[0];

    const formatarPreco = (preco: number) => {
        return preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const handleComprar = () => {
        if (!ofertaAtual) return;
        router.get(route('checkout.index'), {
            ofertaId: ofertaAtual.id,
        });
    };

    if (!pacote) {
        return (
            <GuestLayout title="Pacote não encontrado">
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Pacote "{nome}" não encontrado
                        </h2>
                        <button
                            onClick={() => window.history.back()}
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    const todasFotos = [
        { id: -1, url: pacote.fotos_do_pacote?.foto_capa, nome: 'Principal' },
        ...(pacote.fotos_do_pacote?.fotos?.map((f) => ({
            ...f,
            url: f.caminho,
        })) || []),
    ].filter((f) => f.url);

    return (
        <GuestLayout title={pacote.nome}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4 text-sm">
                        <li>
                            <Link
                                href="/"
                                className="text-gray-400 hover:text-gray-500"
                            >
                                Início
                            </Link>
                        </li>
                        <li>
                            <span className="text-gray-300">/</span>
                        </li>
                        <li>
                            <Link
                                href="/buscar"
                                className="text-gray-400 hover:text-gray-500"
                            >
                                Busca
                            </Link>
                        </li>
                        <li>
                            <span className="text-gray-300">/</span>
                        </li>
                        <li>
                            <span className="max-w-[200px] truncate font-medium text-gray-600">
                                {pacote.nome}
                            </span>
                        </li>
                    </ol>
                </nav>

                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
                        {/* Galeria */}
                        <div className="space-y-4">
                            <div
                                className="group aspect-w-16 aspect-h-12 relative cursor-zoom-in overflow-hidden rounded-xl bg-gray-100"
                                onClick={() => setModalAberto(true)}
                            >
                                <img
                                    src={
                                        imagemSelecionada || '/placeholder.jpg'
                                    }
                                    alt={pacote.nome}
                                    className="h-96 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="bg-opacity-0 group-hover:bg-opacity-10 absolute inset-0 flex items-center justify-center transition-all">
                                    <span className="bg-opacity-50 rounded-full bg-black px-3 py-1 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                                        Ver em tela cheia
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {todasFotos.map((foto, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setImagemSelecionada(foto.url || '')
                                        }
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                            imagemSelecionada === foto.url
                                                ? 'border-blue-500 opacity-100'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={foto.url}
                                            alt={foto.nome}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Detalhes */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                    {pacote.nome}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Building2 className="text-xl" />
                                        <span>
                                            {ofertaAtual?.hotel?.cidade?.nome} -{' '}
                                            {
                                                ofertaAtual?.hotel?.cidade
                                                    ?.estado?.sigla
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="text-xl" />
                                        <span>
                                            {ofertaAtual
                                                ? formatarData(
                                                      ofertaAtual.inicio,
                                                  )
                                                : ''}{' '}
                                            até{' '}
                                            {ofertaAtual
                                                ? formatarData(ofertaAtual.fim)
                                                : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Plane className="text-xl" />
                                        <span>
                                            {ofertaAtual?.transporte?.meio} (
                                            {ofertaAtual?.transporte?.empresa})
                                        </span>
                                    </div>
                                </div>
                                {pacote.tags && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {pacote.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold tracking-wide text-blue-600 uppercase"
                                            >
                                                {tag.nome}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-6">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-bold text-blue-900">
                                        {formatarPreco(
                                            (ofertaAtual?.preco || 0) *
                                                numeroPessoas,
                                        )}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        / total para {numeroPessoas}{' '}
                                        {numeroPessoas > 1
                                            ? 'pessoas'
                                            : 'pessoa'}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <CreditCard className="mr-1" /> Preço
                                    individual:{' '}
                                    {formatarPreco(ofertaAtual?.preco || 0)}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-lg font-semibold text-gray-900">
                                    Escolha a data da viagem
                                </label>
                                <div className="flex flex-col gap-2">
                                    {pacote.ofertas?.map((oferta) => (
                                        <label
                                            key={oferta.id}
                                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                                                ofertaSelecionadaId ===
                                                oferta.id
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="oferta"
                                                    checked={
                                                        ofertaSelecionadaId ===
                                                        oferta.id
                                                    }
                                                    onChange={() =>
                                                        setOfertaSelecionadaId(
                                                            oferta.id,
                                                        )
                                                    }
                                                    className="h-5 w-5 cursor-pointer text-blue-600 focus:ring-blue-500"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {formatarData(
                                                            oferta.inicio,
                                                        )}{' '}
                                                        a{' '}
                                                        {formatarData(
                                                            oferta.fim,
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Hotel:{' '}
                                                        {oferta.hotel?.nome} |{' '}
                                                        {
                                                            oferta.transporte
                                                                ?.meio
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">
                                                    {formatarPreco(
                                                        oferta.preco,
                                                    )}
                                                </div>
                                                <div className="text-xs font-medium text-green-600">
                                                    {oferta.disponibilidade}{' '}
                                                    vagas
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleComprar}
                                className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
                            >
                                <TicketsPlane className="text-2xl" />
                                <span>Reservar Agora</span>
                            </button>

                            <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
                                <h3 className="mb-2 font-bold text-gray-900">
                                    Sobre o Pacote
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {pacote.descricao}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 px-8 py-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <h3 className="mb-3 text-lg font-bold text-gray-900">
                                    Hospedagem
                                </h3>
                                <div className="rounded-lg border bg-white p-4">
                                    <p className="font-semibold text-blue-800">
                                        {ofertaAtual?.hotel?.nome}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Diária média inclusa:{' '}
                                        {formatarPreco(
                                            ofertaAtual?.hotel?.diaria || 0,
                                        )}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {ofertaAtual?.hotel?.cidade?.nome},{' '}
                                        {
                                            ofertaAtual?.hotel?.cidade?.estado
                                                ?.sigla
                                        }
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-bold text-gray-900">
                                    Transporte Incluso
                                </h3>
                                <div className="rounded-lg border bg-white p-4">
                                    <p className="font-semibold text-blue-800">
                                        {ofertaAtual?.transporte?.empresa}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Tipo: {ofertaAtual?.transporte?.meio}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Lightbox */}
            {modalAberto && (
                <div
                    className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
                    onClick={() => setModalAberto(false)}
                >
                    <button className="absolute top-4 right-4 text-4xl text-white hover:text-gray-300">
                        &times;
                    </button>
                    <img
                        src={imagemSelecionada}
                        alt="Tela cheia"
                        className="max-h-full max-w-full rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </GuestLayout>
    );
}
