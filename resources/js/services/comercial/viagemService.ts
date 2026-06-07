import { useForm } from '@inertiajs/react';
import { salvar_avaliacao } from '@/routes/usuario/viagem';

export function useViagemAvaliacao(
    compraId: string,
    notaExistente: number = 0,
    comentarioExistente: string = '',
) {
    const form = useForm({
        nota: notaExistente,
        comentario: comentarioExistente,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(salvar_avaliacao({ id: compraId }).url);
    };

    return {
        form,
        handleSubmit,
    };
}
