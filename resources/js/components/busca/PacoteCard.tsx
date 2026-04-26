import { Link } from '@inertiajs/react';
import { Banknote, LocateFixed } from 'lucide-react';
import { useRoute } from 'ziggy-js';
import type { Pacote } from '@/types/Pacote';
import Image from '../Image';

const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor);
};

export default function PacoteCard({ pacote }: { pacote: Pacote }) {
    const route = useRoute();
    const ofertaExibida = pacote.cheapest_active_offer || pacote.latest_offer;
    const destino =
        ofertaExibida?.hotel?.cidade?.nome || 'Destino Desconhecido';
    const fotoUrl = pacote.fotos_do_pacote?.foto_capa_url || 'placeholder';
    const temOfertaAtiva = (pacote.active_ofertas_count ?? 0) > 0;

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
            <div className="relative h-48 overflow-hidden">
                <Image
                    name={fotoUrl}
                    alt={pacote.nome}
                    style="h-full w-full object-cover transition-transform hover:scale-105"
                />
                {!temOfertaAtiva && (
                    <div className="absolute top-2 right-2 rounded bg-orange-600 px-2 py-1 text-xs font-bold text-white opacity-90 shadow-sm">
                        Sem ofertas no momento
                    </div>
                )}
                {pacote.latest_offer?.status === 'CONCLUIDO' &&
                    temOfertaAtiva && (
                        <div className="absolute top-2 right-2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-80">
                            Encerrado
                        </div>
                    )}
            </div>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-1 line-clamp-1 text-lg font-bold text-gray-900">
                    {pacote.nome}
                </h3>
                <p className="mb-2 flex items-center text-sm text-gray-500">
                    <LocateFixed className="mr-1 text-xl" />
                    {destino}
                </p>
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600">
                    {pacote.descricao}
                </p>
                <div className="block items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                        {temOfertaAtiva ? (
                            <>
                                <p className="flex items-center text-xs text-gray-400 uppercase">
                                    <Banknote className="mr-1 text-xl" /> A
                                    partir de
                                </p>
                                <p className="text-xl font-bold text-blue-600">
                                    {formatarValor(ofertaExibida?.preco || 0)}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="flex items-center text-xs text-gray-400 uppercase">
                                    Última viagem em
                                </p>
                                <p className="text-lg font-semibold text-gray-500">
                                    {formatarData(
                                        pacote.latest_offer?.inicio || '',
                                    )}
                                </p>
                            </>
                        )}
                    </div>
                    <Link
                        href={route('pacote.detalhes', { nome: pacote.nome })}
                        className="mt-2 block w-full rounded-lg bg-blue-50 py-2 text-center text-sm font-bold text-blue-600 hover:bg-blue-100"
                    >
                        Detalhes
                    </Link>
                </div>
            </div>
        </div>
    );
}
