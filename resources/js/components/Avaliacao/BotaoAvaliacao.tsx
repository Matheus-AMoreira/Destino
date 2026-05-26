import { useState } from 'react';
import { Star } from 'lucide-react';
import ModalAvaliacao from './ModalAvaliacao';
import { avaliacaoApi } from '@/utils/avaliacaoApi';
import type { Avaliacao } from '@/types/Avaliacao';

interface BotaoAvaliacaoProps {
    pacoteId: number;
    compraId: string;
    onAvaliacaoSalva?: () => void;
    avaliacaoExistente?: Avaliacao;
}

export default function BotaoAvaliacao({
    pacoteId,
    compraId,
    onAvaliacaoSalva,
    avaliacaoExistente,
}: BotaoAvaliacaoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (nota: number, comentario: string) => {
        if (avaliacaoExistente) {
            await avaliacaoApi.atualizarAvaliacao(avaliacaoExistente.id, {
                nota,
                comentario: comentario || undefined,
            });
        } else {
            await avaliacaoApi.criarAvaliacao({
                pacote_id: pacoteId,
                compra_id: compraId,
                nota,
                comentario: comentario || undefined,
            });
        }

        onAvaliacaoSalva?.();
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-300 rounded-md transition-colors"
            >
                <Star size={18} />
                {avaliacaoExistente ? 'Editar Avaliação' : 'Avaliar'}
            </button>

            <ModalAvaliacao
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                avaliacaoExistente={avaliacaoExistente}
            />
        </>
    );
}
