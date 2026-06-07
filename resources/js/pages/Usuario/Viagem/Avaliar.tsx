import { Head, Link } from '@inertiajs/react';
import { ArrowLeftFromLine, MessageSquare, Star } from 'lucide-react';
import { useState } from 'react';
import GuestLayout from '@/layouts/GuestLayout';
import type { Auth } from '@/types';
import { useViagemAvaliacao } from '@/services/comercial/viagemService';
import { detalhes as routeViagemDetalhes } from '@/routes/usuario/viagem';

interface Compra {
    id: string;
    valor_final: number;
    status: string;
    data_compra: string;
    oferta: {
        id: number;
        inicio: string;
        fim: string;
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
            };
        };
    };
}

interface AvaliacaoExistente {
    id: number;
    nota: number;
    comentario: string | null;
}

interface Props {
    compra: Compra;
    avaliacaoExistente?: AvaliacaoExistente;
    auth: Auth;
}

export default function Avaliar({ compra, avaliacaoExistente, auth }: Props) {
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const { form, handleSubmit } = useViagemAvaliacao(
        compra.id,
        avaliacaoExistente?.nota,
        avaliacaoExistente?.comentario || '',
    );

    const { data, setData, processing, errors } = form;
    const formErrors = errors as Record<string, string>;

    const formatarData = (dataIso: string) => {
        return new Date(dataIso).toLocaleDateString('pt-BR');
    };

    const getStarText = (star: number) => {
        switch (star) {
            case 1:
                return 'Péssimo';
            case 2:
                return 'Ruim';
            case 3:
                return 'Regular';
            case 4:
                return 'Muito Bom';
            case 5:
                return 'Excelente';
            default:
                return 'Escolha uma nota';
        }
    };

    return (
        <GuestLayout>
            <Head title={`Avaliar Viagem: ${compra.oferta.pacote.nome}`} />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link
                            href={routeViagemDetalhes({ id: compra.id }).url}
                            className="group inline-flex items-center text-sm font-black tracking-widest text-blue-600 uppercase transition-colors hover:text-blue-700"
                        >
                            <ArrowLeftFromLine className="mr-3 transition-transform group-hover:-translate-x-1" />
                            Voltar para Detalhes da Viagem
                        </Link>
                    </div>

                    {/* Main Container */}
                    <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-2xl shadow-blue-50/50">
                        {/* Header Banner */}
                        <div className="relative bg-linear-to-br from-gray-900 to-blue-900 p-8 text-white md:p-12">
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-25"
                                style={{
                                    backgroundImage: `url(${compra.oferta.pacote.fotos_do_pacote?.foto_capa_url || '/assets/images/placeholder.jpg'})`,
                                }}
                            />
                            <div className="relative z-10">
                                <span className="mb-2 inline-block rounded-full bg-blue-500/25 border border-blue-400/30 px-3 py-1 text-xs font-bold tracking-widest uppercase">
                                    Avaliação da Experiência
                                </span>
                                <h1 className="font-outfit text-3xl font-black md:text-4xl leading-tight">
                                    Como foi sua viagem para{' '}
                                    {compra.oferta.pacote.nome}?
                                </h1>
                                <p className="mt-2 text-sm md:text-base font-medium text-gray-300">
                                    Hospedagem no {compra.oferta.hotel.nome} •{' '}
                                    {formatarData(compra.oferta.inicio)} a{' '}
                                    {formatarData(compra.oferta.fim)}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-8 md:p-12 space-y-10"
                        >
                            {/* General errors */}
                            {formErrors.error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-bold">
                                    {formErrors.error}
                                </div>
                            )}

                            {/* Note Star Rating */}
                            <div className="text-center space-y-4">
                                <label className="block text-xs font-black tracking-[0.2em] text-gray-400 uppercase">
                                    Sua Nota de 1 a 5 Estrelas
                                </label>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setData('nota', star)
                                            }
                                            onMouseEnter={() =>
                                                setHoveredStar(star)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredStar(null)
                                            }
                                            className="group relative transition-transform hover:scale-125 focus:outline-none"
                                        >
                                            <Star
                                                size={48}
                                                className={`transition-all duration-300 ${
                                                    star <=
                                                    (hoveredStar ?? data.nota)
                                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                                        : 'text-gray-200 hover:text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-lg font-black text-gray-800 transition-all duration-300">
                                    {getStarText(hoveredStar ?? data.nota)}
                                </p>
                                {errors.nota && (
                                    <p className="text-sm font-bold text-red-500">
                                        {errors.nota}
                                    </p>
                                )}
                            </div>

                            {/* Comment */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">
                                    <MessageSquare size={16} />
                                    <span>Seu Comentário</span>
                                </label>
                                <textarea
                                    value={data.comentario}
                                    onChange={(e) =>
                                        setData('comentario', e.target.value)
                                    }
                                    maxLength={500}
                                    rows={5}
                                    className={`w-full px-5 py-4 border rounded-3xl text-gray-800 placeholder-gray-400 transition-all duration-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ${
                                        errors.comentario
                                            ? 'border-red-300'
                                            : 'border-gray-200'
                                    }`}
                                    placeholder="Compartilhe os detalhes da sua viagem. Como foi a hospedagem, o transporte e os passeios?"
                                />
                                <div className="flex justify-between items-center text-xs font-bold text-gray-400 px-2">
                                    <span>
                                        {errors.comentario && (
                                            <span className="text-red-500">
                                                {errors.comentario}
                                            </span>
                                        )}
                                    </span>
                                    <span>
                                        {data.comentario.length}/500 caracteres
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                                <Link
                                    href={
                                        routeViagemDetalhes({ id: compra.id })
                                            .url
                                    }
                                    className="flex-1 rounded-2xl border-2 border-gray-200 bg-white py-4 text-center text-sm font-black text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || data.nota === 0}
                                    className="flex-1 rounded-2xl bg-blue-600 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {processing
                                        ? 'Enviando...'
                                        : avaliacaoExistente
                                          ? 'Salvar Alterações'
                                          : 'Enviar Avaliação'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
