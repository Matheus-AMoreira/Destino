import { X } from 'lucide-react';
import { useState } from 'react';

interface ModalAvaliacaoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (nota: number, comentario: string) => Promise<void>;
    avaliacaoExistente?: App.DTOs.Comercial.AvaliacaoDTO;
}

export default function ModalAvaliacao({
    isOpen,
    onClose,
    onSubmit,
    avaliacaoExistente,
}: ModalAvaliacaoProps) {
    const [nota, setNota] = useState(avaliacaoExistente?.nota || 0);
    const [comentario, setComentario] = useState(
        avaliacaoExistente?.comentario || '',
    );
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nota === 0) {
            setErro('Selecione uma nota');
            return;
        }

        setLoading(true);
        setErro(null);

        try {
            await onSubmit(nota, comentario);
            setNota(0);
            setComentario('');
            onClose();
        } catch (err) {
            setErro(
                err instanceof Error ? err.message : 'Erro ao enviar avaliação',
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">
                        {avaliacaoExistente
                            ? 'Editar Avaliação'
                            : 'Avaliar Pacote'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {erro && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {erro}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Qual sua nota?
                        </label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNota(star)}
                                    className={`text-4xl transition-transform hover:scale-110 ${
                                        star <= nota
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comentário (opcional)
                        </label>
                        <textarea
                            value={comentario}
                            onChange={(e) =>
                                setComentario(e.target.value.slice(0, 500))
                            }
                            maxLength={500}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Compartilhe sua experiência..."
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            {comentario.length}/500 caracteres
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || nota === 0}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 'Enviar Avaliação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
