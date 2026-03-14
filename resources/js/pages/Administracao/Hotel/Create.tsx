import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { Hotel, Save, X, MapPin, Building, Banknote } from 'lucide-react';
import React, { useMemo } from 'react';

interface Regiao {
    id: number;
    nome: string;
}

interface Estado {
    id: number;
    nome: string;
    sigla: string;
    regiao_id: number;
}

interface Cidade {
    id: number;
    nome: string;
    estado_id: number;
}

interface Props {
    regioes: Regiao[];
    estados: Estado[];
    cidades: Cidade[];
}

export default function Create({ regioes, estados, cidades }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        endereco: '',
        diaria: 0,
        cidade_id: '',
        regiao_id: '',
        estado_id: '',
    });

    const filteredEstados = useMemo(() => {
        if (!data.regiao_id) return [];
        return estados.filter(e => e.regiao_id === Number(data.regiao_id));
    }, [data.regiao_id, estados]);

    const filteredCidades = useMemo(() => {
        if (!data.estado_id) return [];
        return cidades.filter(c => c.estado_id === Number(data.estado_id));
    }, [data.estado_id, cidades]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/administracao/hotel/registrar');
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title="Novo Hotel">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/administracao/hotel/listar"
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Novo Hotel</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClasses}>
                                <Building size={16} className="text-blue-500" />
                                Nome do Hotel
                            </label>
                            <input
                                type="text"
                                value={data.nome}
                                onChange={e => setData('nome', e.target.value)}
                                className={inputClasses}
                                placeholder="Ex: Grand Hyatt Rio"
                            />
                            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClasses}>
                                <MapPin size={16} className="text-blue-500" />
                                Endereço Completo
                            </label>
                            <input
                                type="text"
                                value={data.endereco}
                                onChange={e => setData('endereco', e.target.value)}
                                className={inputClasses}
                                placeholder="Av. Lucio Costa, 9600 - Barra da Tijuca"
                            />
                            {errors.endereco && <p className="mt-1 text-xs text-red-500">{errors.endereco}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Banknote size={16} className="text-blue-500" />
                                Valor da Diária (R$)
                            </label>
                            <input
                                type="number"
                                value={data.diaria}
                                onChange={e => setData('diaria', Number(e.target.value))}
                                className={inputClasses}
                                min="0"
                                step="1"
                            />
                            {errors.diaria && <p className="mt-1 text-xs text-red-500">{errors.diaria}</p>}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">Localização</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-500">Região</label>
                                <select
                                    value={data.regiao_id}
                                    onChange={e => {
                                        setData(d => ({ ...d, regiao_id: e.target.value, estado_id: '', cidade_id: '' }));
                                    }}
                                    className={inputClasses}
                                >
                                    <option value="">Selecione...</option>
                                    {regioes.map(r => (
                                        <option key={r.id} value={r.id}>{r.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500">Estado</label>
                                <select
                                    value={data.estado_id}
                                    onChange={e => {
                                        setData(d => ({ ...d, estado_id: e.target.value, cidade_id: '' }));
                                    }}
                                    disabled={!data.regiao_id}
                                    className={`${inputClasses} disabled:bg-gray-50 disabled:text-gray-400`}
                                >
                                    <option value="">Selecione...</option>
                                    {filteredEstados.map(e => (
                                        <option key={e.id} value={e.id}>{e.nome} ({e.sigla})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500">Cidade</label>
                                <select
                                    value={data.cidade_id}
                                    onChange={e => setData('cidade_id', e.target.value)}
                                    disabled={!data.estado_id}
                                    className={`${inputClasses} disabled:bg-gray-50 disabled:text-gray-400`}
                                >
                                    <option value="">Selecione...</option>
                                    {filteredCidades.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                                {errors.cidade_id && <p className="mt-1 text-xs text-red-500">{errors.cidade_id}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/administracao/hotel/listar"
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
                            <span>{processing ? 'Salvando...' : 'Salvar Hotel'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
