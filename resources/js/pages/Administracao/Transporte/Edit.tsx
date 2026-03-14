import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { Truck, Save, X, Building, Banknote, Ship, Plane, Bus } from 'lucide-react';
import React from 'react';

interface TransporteData {
    id: number;
    empresa: string;
    meio: string;
    preco: number;
}

interface Props {
    transporte: TransporteData;
    meios: string[];
}

export default function Edit({ transporte, meios }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        empresa: transporte.empresa,
        meio: transporte.meio,
        preco: transporte.preco,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/administracao/transporte/editar/${transporte.id}`);
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title={`Editar ${transporte.empresa}`}>
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/administracao/transporte/listar"
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Transporte</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div>
                        <label className={labelClasses}>
                            <Building size={16} className="text-blue-500" />
                            Nome da Empresa
                        </label>
                        <input
                            type="text"
                            value={data.empresa}
                            onChange={e => setData('empresa', e.target.value)}
                            className={inputClasses}
                        />
                        {errors.empresa && <p className="mt-1 text-xs text-red-500">{errors.empresa}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className={labelClasses}>
                                <Truck size={16} className="text-blue-500" />
                                Meio de Transporte
                            </label>
                            <select
                                value={data.meio}
                                onChange={e => setData('meio', e.target.value)}
                                className={inputClasses}
                            >
                                <option value="">Selecione...</option>
                                {meios.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            {errors.meio && <p className="mt-1 text-xs text-red-500">{errors.meio}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Banknote size={16} className="text-blue-500" />
                                Preço Base (R$)
                            </label>
                            <input
                                type="number"
                                value={data.preco}
                                onChange={e => setData('preco', Number(e.target.value))}
                                className={inputClasses}
                                min="0"
                            />
                            {errors.preco && <p className="mt-1 text-xs text-red-500">{errors.preco}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/administracao/transporte/listar"
                            className="rounded-lg px-6 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50"
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
