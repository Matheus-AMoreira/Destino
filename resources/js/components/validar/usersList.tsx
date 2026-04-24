import { router } from '@inertiajs/react';
import type { User } from '@/types/auth';

interface UsersListProps {
    user: User;
}

export default function UsersList({ user }: UsersListProps) {
    const handleValidar = () => {
        if (confirm(`Deseja validar o usuário ${user.nome}?`)) {
            router.post(route('administracao.usuario.aprovar', { user: user.id }));
        }
    };

    return (
        <>
            <div className="p-4 border rounded-xl bg-white shadow-sm">
                <p className="font-bold">{user.nome} {user.sobre_nome}</p>
                <p className="text-sm text-gray-500">{user.cpf}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={handleValidar}
                >
                    Validar
                </button>
            </div>
        </>
    );
}
