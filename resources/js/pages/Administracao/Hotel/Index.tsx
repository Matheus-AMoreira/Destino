import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Hotel, Plus, Pencil, Trash2, MapPin } from 'lucide-react';

interface Cidade {
    id: number;
    nome: string;
    estado: {
        id: number;
        sigla: string;
    };
}

interface HotelData {
    id: number;
    nome: string;
    endereco: string;
    diaria: number;
    cidade: Cidade;
}

interface Props {
    hotels: HotelData[];
    success?: string;
}

export default function Index({ hotels = [], success }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Deseja realmente excluir este hotel?')) {
            router.delete(`/administracao/hotel/${id}`);
        }
    };

    return (
        <AdminLayout title="Gerenciar Hotéis">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Hotel size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Hotéis</h1>
                </div>
                
                <Link
                    href="/administracao/hotel/registrar"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>Novo Hotel</span>
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
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nome</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Localização</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Diária</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">#{hotel.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900">{hotel.nome}</div>
                                        <div className="text-xs text-gray-500">{hotel.endereco}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {hotel.cidade ? (
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-gray-400" />
                                                <span>{hotel.cidade.nome} / {hotel.cidade.estado.sigla}</span>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        R$ {Number(hotel.diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/administracao/hotel/editar/${hotel.id}`}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(hotel.id)}
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
                                    Nenhum hotel cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
