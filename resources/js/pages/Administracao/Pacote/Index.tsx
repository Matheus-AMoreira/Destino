import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Package, Plus, Pencil, Trash2, User, Image as ImageIcon } from 'lucide-react';

interface PacoteData {
    id: number;
    nome: string;
    descricao: string;
    funcionario?: { id: string; nome: string };
    fotos_do_pacote?: { id: number; nome: string };
}

interface Props {
    pacotes: PacoteData[];
    success?: string;
}

export default function Index({ pacotes = [], success }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Deseja realmente excluir este pacote?')) {
            router.delete(`/administracao/pacote/${id}`);
        }
    };

    return (
        <AdminLayout title="Gerenciar Pacotes">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-600 p-2 rounded-lg text-white">
                        <Package size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pacotes</h1>
                </div>
                
                <Link
                    href="/administracao/pacote/registrar"
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-orange-700"
                >
                    <Plus size={20} />
                    <span>Novo Pacote</span>
                </Link>
            </div>

            {success && (
                <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
                    {success}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pacote</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Responsável</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Álbum</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {pacotes.length > 0 ? (
                            pacotes.map((pacote) => (
                                <tr key={pacote.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{pacote.nome}</div>
                                        <div className="text-sm text-gray-500 line-clamp-1">{pacote.descricao}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            {pacote.funcionario?.nome || 'Não atribuído'}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon size={16} className="text-gray-400" />
                                            {pacote.fotos_do_pacote?.nome || 'Sem álbum'}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/administracao/pacote/editar/${pacote.id}`}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(pacote.id)}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                    Nenhum pacote cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
