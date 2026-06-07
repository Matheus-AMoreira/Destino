import type { User } from '@/types/auth';

interface UsersListProps {
    user: User;
    onValidar: (user: User) => void;
}

export default function UsersList({ user, onValidar }: UsersListProps) {
    const handleValidar = () => {
        onValidar(user);
    };

    return (
        <>
            <div className="p-4 border rounded-xl bg-white shadow-sm">
                <p className="font-bold">
                    {user.nome} {user.sobre_nome}
                </p>
                <p className="text-sm text-gray-500">
                    {user.cpf_mascarado || user.cpf}
                </p>
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
