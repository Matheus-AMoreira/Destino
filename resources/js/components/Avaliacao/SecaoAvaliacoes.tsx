import { Star } from 'lucide-react';
import { useAvaliacoes } from '@/services/comercial/avaliacaoService';
import AvaliacaoItem from './AvaliacaoItem';

interface SecaoAvaliacoesProps {
    pacoteId: number;
    userId?: string;
    onAvaliacaoDeleted?: () => void;
}

export default function SecaoAvaliacoes({
    pacoteId,
    userId,
    onAvaliacaoDeleted,
}: SecaoAvaliacoesProps) {
    const { avaliacoes, loading, erro, handleDeletar } = useAvaliacoes(
        pacoteId,
        onAvaliacaoDeleted,
    );

    if (loading) {
        return (
            <div className="py-8 text-center text-gray-500">
                Carregando avaliações...
            </div>
        );
    }

    if (erro) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">{erro}</div>
        );
    }

    if (!avaliacoes || avaliacoes.quantidadeAvaliacoes === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                Nenhuma avaliação ainda. Seja o primeiro a avaliar!
            </div>
        );
    }

    const notaMediaArredondada = Math.round(avaliacoes.notaMedia * 10) / 10;

    return (
        <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Avaliação e Comentário</h3>

            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-yellow-400">
                        {notaMediaArredondada.toFixed(1)}
                    </div>
                    <div className="flex-1">
                        <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={
                                        i < Math.round(avaliacoes.notaMedia)
                                            ? 'text-yellow-400 text-2xl'
                                            : 'text-gray-300 text-2xl'
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600">
                            {avaliacoes.quantidadeAvaliacoes}{' '}
                            {avaliacoes.quantidadeAvaliacoes === 1
                                ? 'avaliação'
                                : 'avaliações'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {avaliacoes.avaliacoes.map((avaliacao) => (
                    <AvaliacaoItem
                        key={avaliacao.id}
                        avaliacao={avaliacao}
                        isOwner={userId === avaliacao.user_id}
                        onDeletar={() => handleDeletar(avaliacao.id)}
                    />
                ))}
            </div>
        </section>
    );
}
