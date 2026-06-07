import { Link } from '@inertiajs/react';
import { Hotel, MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    create as createHotel,
    edit as editHotel,
    index as indexHotel,
} from '@/routes/administracao/hotel';
import { useHotelList } from '@/services/hospedagem/hotelService';

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
    filters?: {
        termo?: string;
    };
}

export default function Index({ hotels = [], success, filters = {} }: Props) {
    const { termo, setTermo, handleSearch, handleDelete } = useHotelList(
        filters.termo || '',
    );

    return (
        <AdminLayout title="Gerenciar Hotéis">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Hotel size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Gerenciar Hotéis
                    </h1>
                </div>

                <Link
                    href={createHotel().url}
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

            {/* Barra de Filtros */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <form
                    onSubmit={handleSearch}
                    className="relative w-full sm:w-96"
                >
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Buscar por nome, endereço ou localização..."
                        value={termo}
                        onChange={(e) => setTermo(e.target.value)}
                        className="w-full rounded-lg border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                    />
                </form>

                <div className="text-xs text-gray-400 font-medium">
                    Exibindo {hotels.length} registro
                    {hotels.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Nome
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Localização
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Diária
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                                <tr
                                    key={hotel.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        #{hotel.id}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {hotel.nome}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {hotel.endereco}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {hotel.cidade ? (
                                            <div className="flex items-center gap-1">
                                                <MapPin
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                                <span>
                                                    {hotel.cidade.nome} /{' '}
                                                    {hotel.cidade.estado.sigla}
                                                </span>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        R${' '}
                                        {Number(hotel.diaria).toLocaleString(
                                            'pt-BR',
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={
                                                    editHotel({ id: hotel.id })
                                                        .url
                                                }
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(hotel.id)
                                                }
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
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-sm text-gray-500"
                                >
                                    {termo ? (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Search
                                                size={48}
                                                className="opacity-20"
                                            />
                                            <p className="text-sm font-medium">
                                                Nenhum hotel encontrado para "
                                                {termo}".
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setTermo('');
                                                    window.location.href =
                                                        indexHotel().url;
                                                }}
                                                className="text-xs text-blue-600 hover:underline mt-1 font-semibold"
                                            >
                                                Limpar filtro
                                            </button>
                                        </div>
                                    ) : (
                                        'Nenhum hotel cadastrado.'
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
