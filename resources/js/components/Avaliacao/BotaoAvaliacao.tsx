import { Star } from 'lucide-react';
import { useState } from 'react';
import { useAvaliacaoForm } from '@/services/comercial/avaliacaoService';
import ModalAvaliacao from './ModalAvaliacao';

interface BotaoAvaliacaoProps {
    pacoteId: number;
    compraId: string;
    onAvaliacaoSalva?: () => void;
    avaliacaoExistente?: App.DTOs.Comercial.AvaliacaoDTO;
}

export default function BotaoAvaliacao({
    pacoteId,
    compraId,
    onAvaliacaoSalva,
    avaliacaoExistente,
}: BotaoAvaliacaoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { enviarAvaliacao } = useAvaliacaoForm({
        pacoteId,
        compraId,
        avaliacaoExistente,
        onSuccess: () => {
            onAvaliacaoSalva?.();
            setIsModalOpen(false);
        },
    });

    const handleSubmit = async (nota: number, comentario: string) => {
        await enviarAvaliacao(nota, comentario);
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
