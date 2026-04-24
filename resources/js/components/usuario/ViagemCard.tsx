import { Link } from '@inertiajs/react';
import {
    ArrowRightFromLine,
    CalendarDays,
    MapPin,
    Ticket,
} from 'lucide-react';
import { useState } from 'react';
import Image from '@/components/Image';
import ImageCarousel from '@/components/ImageCarousel';

interface ViagemCardProps {
    grupo: any;
    isHistorico: boolean;
    formatarValor: (valor: number) => string;
    formatarData: (dataIso: string) => string;
    getStatusColor: (status: string) => string;
    auth: any;
}

export default function ViagemCard({
    grupo,
    isHistorico,
    formatarValor,
    formatarData,
    getStatusColor,
    auth,
}: ViagemCardProps) {
    const [imagemSelecionada, setImagemSelecionada] = useState(
        grupo.pacote.fotos_do_pacote?.foto_capa_url || '/assets/images/placeholder.jpg'
    );

    const todasFotos = [
        ...(grupo.pacote.fotos_do_pacote?.foto_capa_url ? [{ url: grupo.pacote.fotos_do_pacote.foto_capa_url }] : []),
        ...(grupo.pacote.fotos_do_pacote?.fotos?.map((f: any) => ({ url: f.caminho_url })) || []),
    ].filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

    return (
        <div
            className={`group flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/50 ${isHistorico ? 'opacity-90 saturate-50' : ''
                } w-full`}
        >
            <div className="relative h-72 lg:h-auto lg:w-1/3 overflow-hidden">
                <Image
                    name={imagemSelecionada}
                    alt={grupo.pacote.nome}
                    style="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                <div className="absolute top-4 left-4 flex gap-2">
                    {grupo.tickets.length > 1 && (
                        <span className="flex items-center gap-2 rounded-xl bg-blue-600/90 px-3 py-1.5 text-xs font-black text-white shadow-lg backdrop-blur-md">
                            <Ticket size={14} />
                            {grupo.tickets.length} PASSAGENS
                        </span>
                    )}
                </div>

                <ImageCarousel 
                    photos={todasFotos} 
                    onImageChange={setImagemSelecionada} 
                />

                <div className="absolute bottom-4 left-6">
                    <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-1 text-sm font-bold text-white/90 backdrop-blur-md">
                        <MapPin className="text-red-400" size={16} />
                        <span>
                            {grupo.tickets[0].oferta.hotel.cidade.nome}, {grupo.tickets[0].oferta.hotel.cidade.estado.sigla}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-8">
                <h3 className="font-outfit mb-3 text-2xl font-black text-gray-900 transition-colors group-hover:text-blue-600">
                    {grupo.pacote.nome}
                </h3>

                <p className="mb-6 line-clamp-2 text-sm leading-relaxed font-medium text-gray-500">
                    {grupo.pacote.descricao}
                </p>

                <div className="mt-auto space-y-4 border-t border-gray-100 pt-6">
                    {grupo.tickets.map((compra: any, idx: number) => (
                        <div key={compra.id} className={`${idx > 0 ? 'mt-4 border-t border-gray-50 pt-4' : ''}`}>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase ${getStatusColor(compra.status)}`}>
                                        {isHistorico ? 'CONCLUÍDA' : compra.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                                        Ticket #{compra.id.split('-')[0]}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-black text-gray-900">
                                        {formatarValor(compra.valor_final)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-4 transition-colors group-hover:border-blue-100/50 group-hover:bg-blue-50/50">
                                <div className="flex items-center gap-3">
                                    <CalendarDays className="text-blue-500" size={18} />
                                    <span className="text-sm font-bold text-gray-700">
                                        {formatarData(compra.oferta.inicio)} - {formatarData(compra.oferta.fim)}
                                    </span>
                                </div>
                                <Link
                                    href={route('usuario.viagem.detalhes', {
                                        user_slug: auth.user.name_slug,
                                        compra: compra.id,
                                    })}
                                    className="flex items-center gap-1 text-sm font-black text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    Detalhes
                                    <ArrowRightFromLine size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
