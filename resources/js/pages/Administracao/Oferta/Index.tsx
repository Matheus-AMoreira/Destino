import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Tag, Plus, Pencil, Trash2, Calendar, Hotel, Truck, Package } from 'lucide-react';

interface OfertaData {
    id: number;
    preco: string | number;
    inicio: string;
    fim: string;
    disponibilidade: number;
    status: string;
    pacote?: { id: number; nome: string };
    hotel?: { id: number; nome: string };
    transporte?: { id: number; empresa: string };
}

interface Props {
    ofertas: OfertaData[];
    success?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'EMANDAMENTO':
            return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold uppercase">Ativa</span>;
        case 'CANCELADO':
            return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold uppercase">Cancelada</span>;
        default:
            return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold uppercase">Concluída</span>;
    }
};

export default function Index({ ofertas = [], success }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Deseja realmente excluir esta oferta?')) {
            router.delete(`/administracao/oferta/${id}`);
        }
    };

    return (
        <AdminLayout title="Gerenciar Ofertas">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-2 rounded-lg text-white">
                        <Tag size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Ofertas</h1>
                </div>
                
                <Link
                    href="/administracao/oferta/registrar"
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Plus size={20} />
                    <span>Nova Oferta</span>
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
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pacote / Período</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Preço / Vagas</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Detalhes</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {ofertas.length > 0 ? (
                            ofertas.map((oferta) => (
                                <tr key={oferta.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                                            <Package size={16} className="text-orange-500" />
                                            {oferta.pacote?.nome}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                            <Calendar size={14} />
                                            {new Date(oferta.inicio).toLocaleDateString()} - {new Date(oferta.fim).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-lg font-bold text-gray-900">
                                            R$ {Number(oferta.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {oferta.disponibilidade} vagas restantes
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Hotel size={14} className="text-blue-500" />
                                            <span className="truncate max-w-[150px]">{oferta.hotel?.nome}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                            <Truck size={14} className="text-blue-500" />
                                            <span className="truncate max-w-[150px]">{oferta.transporte?.empresa}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={oferta.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/administracao/oferta/editar/${oferta.id}`}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(oferta.id)}
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
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                    Nenhuma oferta cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
