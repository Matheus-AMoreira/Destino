import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Truck, Plus, Pencil, Trash2, Plane, Ship, Bus } from 'lucide-react';

interface TransporteData {
    id: number;
    empresa: string;
    meio: string;
    preco: number;
}

interface Props {
    transportes: TransporteData[];
    success?: string;
}

const MeioIcon = ({ meio }: { meio: string }) => {
    switch (meio) {
        case 'AEREO':
            return <Plane size={18} className="text-blue-500" />;
        case 'MARITIMO':
            return <Ship size={18} className="text-blue-500" />;
        default:
            return <Bus size={18} className="text-blue-500" />;
    }
};

export default function Index({ transportes = [], success }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Deseja realmente excluir este transporte?')) {
            router.delete(`/administracao/transporte/${id}`);
        }
    };

    return (
        <AdminLayout title="Gerenciar Transporte">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Truck size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Transporte</h1>
                </div>
                
                <Link
                    href="/administracao/transporte/registrar"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>Novo Transporte</span>
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
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Empresa</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Meio</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Preço Base</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {transportes.length > 0 ? (
                            transportes.map((transporte) => (
                                <tr key={transporte.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">#{transporte.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                        {transporte.empresa}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <MeioIcon meio={transporte.meio} />
                                            <span className="capitalize">{transporte.meio.toLowerCase()}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        R$ {Number(transporte.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/administracao/transporte/editar/${transporte.id}`}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(transporte.id)}
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
                                    Nenhum transporte cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
