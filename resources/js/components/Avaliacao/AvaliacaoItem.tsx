import { Trash2 } from 'lucide-react';
import { formatarData } from '@/utils/dataUtils';
import type { Avaliacao } from '@/types/Avaliacao';

interface AvaliacaoItemProps {
    avaliacao: Avaliacao;
    isOwner?: boolean;
    onEditar?: () => void;
    onDeletar?: () => void;
}

export default function AvaliacaoItem({
    avaliacao,
    isOwner = false,
    onEditar,
    onDeletar,
}: AvaliacaoItemProps) {
    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
            onDeletar?.();
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                            {avaliacao.nomeUsuario}
                        </h4>
                        <div className="text-yellow-400 flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={
                                        i < avaliacao.nota
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="font-semibold text-gray-800">
                            {avaliacao.nota}/5
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatarData(avaliacao.created_at)}
                    </p>
                </div>

                {isOwner && (
                    <button
                        onClick={handleDelete}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Deletar avaliação"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {avaliacao.comentario && (
                <p className="text-gray-700 text-sm mt-3">{avaliacao.comentario}</p>
            )}
        </div>
    );
}
