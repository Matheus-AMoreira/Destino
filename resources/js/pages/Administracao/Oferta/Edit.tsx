import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { Tag, Save, X, Package, Hotel, Truck, Banknote, Calendar, Users, Info } from 'lucide-react';
import React from 'react';

interface Pacote { id: number; nome: string; }
interface HotelData { id: number; nome: string; }
interface Transporte { id: number; empresa: string; }
interface Status { name: string; value: string; }

interface OfertaData {
    id: number;
    preco: string | number;
    inicio: string;
    fim: string;
    disponibilidade: number;
    status: string;
    pacote_id: number;
    hotel_id: number;
    transporte_id: number;
}

interface Props {
    oferta: OfertaData;
    pacotes: Pacote[];
    hoteis: HotelData[];
    transportes: Transporte[];
    statuses: { name: string; value: string }[];
}

export default function Edit({ oferta, pacotes, hoteis, transportes, statuses }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        preco: Number(oferta.preco),
        inicio: oferta.inicio.split('T')[0],
        fim: oferta.fim.split('T')[0],
        disponibilidade: oferta.disponibilidade,
        pacote_id: oferta.pacote_id,
        hotel_id: oferta.hotel_id,
        transporte_id: oferta.transporte_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/administracao/oferta/editar/${oferta.id}`);
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title={`Editar Oferta #${oferta.id}`}>
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/administracao/oferta/listar"
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Oferta</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2 text-lg font-bold border-b pb-2 flex items-center gap-2 text-gray-800">
                            <Package size={20} className="text-emerald-500" />
                            Relacionamentos Principais
                        </div>

                        <div>
                            <label className={labelClasses}>Pacote de Viagem</label>
                            <select
                                value={data.pacote_id}
                                onChange={e => setData('pacote_id', Number(e.target.value))}
                                className={inputClasses}
                            >
                                {pacotes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                            </select>
                            {errors.pacote_id && <p className="mt-1 text-xs text-red-500">{errors.pacote_id}</p>}
                        </div>


                        <div>
                            <label className={labelClasses}>
                                <Hotel size={16} className="text-blue-500" />
                                Hotel Associado
                            </label>
                            <select
                                value={data.hotel_id}
                                onChange={e => setData('hotel_id', Number(e.target.value))}
                                className={inputClasses}
                            >
                                {hoteis.map(h => <option key={h.id} value={h.id}>{h.nome}</option>)}
                            </select>
                            {errors.hotel_id && <p className="mt-1 text-xs text-red-500">{errors.hotel_id}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Truck size={16} className="text-blue-500" />
                                Transporte Associado
                            </label>
                            <select
                                value={data.transporte_id}
                                onChange={e => setData('transporte_id', Number(e.target.value))}
                                className={inputClasses}
                            >
                                {transportes.map(t => <option key={t.id} value={t.id}>{t.empresa}</option>)}
                            </select>
                            {errors.transporte_id && <p className="mt-1 text-xs text-red-500">{errors.transporte_id}</p>}
                        </div>

                        <div className="md:col-span-2 text-lg font-bold border-b pb-2 flex items-center gap-2 text-gray-800 mt-4">
                            <Info size={20} className="text-emerald-500" />
                            Valores e Datas
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Banknote size={16} className="text-emerald-500" />
                                Preço Total (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.preco}
                                onChange={e => setData('preco', Number(e.target.value))}
                                className={inputClasses}
                            />
                            {errors.preco && <p className="mt-1 text-xs text-red-500">{errors.preco}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Users size={16} className="text-emerald-500" />
                                Vagas Disponíveis
                            </label>
                            <input
                                type="number"
                                value={data.disponibilidade}
                                onChange={e => setData('disponibilidade', Number(e.target.value))}
                                className={inputClasses}
                            />
                            {errors.disponibilidade && <p className="mt-1 text-xs text-red-500">{errors.disponibilidade}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Calendar size={16} className="text-emerald-500" />
                                Data de Início (Ida)
                            </label>
                            <input
                                type="date"
                                value={data.inicio}
                                onChange={e => setData('inicio', e.target.value)}
                                className={inputClasses}
                            />
                            {errors.inicio && <p className="mt-1 text-xs text-red-500">{errors.inicio}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Calendar size={16} className="text-emerald-500" />
                                Data de Fim (Volta)
                            </label>
                            <input
                                type="date"
                                value={data.fim}
                                onChange={e => setData('fim', e.target.value)}
                                className={inputClasses}
                            />
                            {errors.fim && <p className="mt-1 text-xs text-red-500">{errors.fim}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/administracao/oferta/listar"
                            className="rounded-lg px-6 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <Save size={20} />
                            <span>{processing ? 'Salvando...' : 'Salvar Alterações'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
