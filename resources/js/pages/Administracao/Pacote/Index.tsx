import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { 
    Package, 
    Plus, 
    Pencil, 
    Trash2, 
    User as UserIcon, 
    Image as ImageIcon, 
    ShoppingBag, 
    X,
    Calendar,
    MapPin,
    CreditCard
} from 'lucide-react';
import React, { useState } from 'react';

interface PacoteData {
    id: number;
    nome: string;
    descricao: string;
    funcionario?: { id: string; nome: string };
    fotos_do_pacote?: { id: number; nome: string };
}

interface Compra {
    id: string;
    valor_final: number;
    data_compra: string;
    status: string;
    user: {
        nome: string;
        sobre_nome: string;
        email: string;
    };
    oferta: {
        inicio: string;
        fim: string;
        hotel: {
            cidade: {
                nome: string;
            };
        };
    };
}

interface Props {
    pacotes: PacoteData[];
    success?: string;
}

export default function Index({ pacotes = [], success }: Props) {
    const [selectedPacote, setSelectedPacote] = useState<PacoteData | null>(null);
    const [salesList, setSalesList] = useState<Compra[]>([]);
    const [loadingSales, setLoadingSales] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Deseja realmente excluir este pacote?')) {
            router.delete(`/administracao/pacote/${id}`);
        }
    };

    const fetchSales = async (pacote: PacoteData) => {
        setSelectedPacote(pacote);
        setLoadingSales(true);
        try {
            const response = await fetch(route('administracao.pacote.compras', { pacote: pacote.id }));
            const data = await response.json();
            setSalesList(data);
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        } finally {
            setLoadingSales(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
                <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700 font-medium">
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
                                            <UserIcon size={16} className="text-gray-400" />
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
                                            <button
                                                onClick={() => fetchSales(pacote)}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                title="Ver Vendas"
                                            >
                                                <ShoppingBag size={18} />
                                            </button>
                                            <Link
                                                href={`/administracao/pacote/editar/${pacote.id}`}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(pacote.id)}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                                                title="Excluir"
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

            {/* Modal de Vendas */}
            {selectedPacote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPacote(null)} />
                    <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight">Vendas: {selectedPacote.nome}</h3>
                                <p className="text-gray-500 text-sm font-medium">Relatório de compras efetuadas para este pacote.</p>
                            </div>
                            <button onClick={() => setSelectedPacote(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                            {loadingSales ? (
                                <div className="py-20 text-center flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando dados de venda...</p>
                                </div>
                            ) : salesList.length > 0 ? (
                                <div className="space-y-4">
                                    {salesList.map((compra) => (
                                        <div key={compra.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 uppercase">
                                                        {compra.user.nome.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{compra.user.nome} {compra.user.sobre_nome}</p>
                                                        <p className="text-xs text-gray-500 font-medium">{compra.user.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                                        <div className="flex items-center gap-2 text-[10px] uppercase font-black text-gray-400 mb-1">
                                                            <Calendar size={12} />
                                                            <span>Viagem</span>
                                                        </div>
                                                        <p className="text-xs font-bold text-gray-700">
                                                            {formatDate(compra.oferta.inicio)} - {formatDate(compra.oferta.fim)}
                                                        </p>
                                                    </div>

                                                    <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                                        <div className="flex items-center gap-2 text-[10px] uppercase font-black text-blue-400 mb-1">
                                                            <CreditCard size={12} />
                                                            <span>Valor Pago</span>
                                                        </div>
                                                        <p className="text-sm font-black text-blue-600">
                                                            {formatCurrency(compra.valor_final)}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                                            compra.status === 'ACEITO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                            {compra.status}
                                                        </span>
                                                        <p className="text-[10px] text-gray-400 font-bold">Compra em {formatDate(compra.data_compra)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-gray-400">
                                                <MapPin size={10} className="text-gray-300" />
                                                <span>Destino: {compra.oferta.hotel.cidade.nome}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center flex flex-col items-center gap-4">
                                    <ShoppingBag className="text-gray-200" size={60} />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhuma venda registrada para este pacote ainda.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs font-medium text-gray-400 uppercase tracking-widest">
                            <span>Total de Vendas: {salesList.length}</span>
                            <span>Soma Total: {formatCurrency(salesList.reduce((acc, curr) => acc + curr.valor_final, 0))}</span>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
