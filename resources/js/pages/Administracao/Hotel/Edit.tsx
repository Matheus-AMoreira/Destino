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
    regiaoId: number;
}

interface Cidade {
    id: number;
    nome: string;
    estadoId: number;
}

interface HotelData {
    id: number;
    nome: string;
    endereco: string;
    diaria: number;
    cidade_id: number;
    cep?: string;
    cep_data?: any;
    cidade: {
        id: number;
        estado: {
            id: number;
            regiao: {
                id: number;
            }
        }
    }
}

interface Props {
    hotel: HotelData;
    regioes: Regiao[];
    estados: Estado[];
    cidades: Cidade[];
}

export default function Edit({ hotel, regioes, estados, cidades }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nome: hotel.nome,
        endereco: hotel.endereco,
        diaria: hotel.diaria,
        cidade_id: hotel.cidade_id as string | number,
        regiao_id: (hotel.cidade?.estado?.regiao?.id || '') as string | number,
        estado_id: (hotel.cidade?.estado?.id || '') as string | number,
        cep: hotel.cep || '',
        cep_data: hotel.cep_data || null,
    });

    const [isFetchingCep, setIsFetchingCep] = React.useState(false);
    const [cepError, setCepError] = React.useState('');

    const filteredEstados = useMemo(() => {
        if (!data.regiao_id) return [];
        return estados.filter(e => e.regiaoId === Number(data.regiao_id));
    }, [data.regiao_id, estados]);

    const filteredCidades = useMemo(() => {
        if (!data.estado_id) return [];
        return cidades.filter(c => c.estadoId === Number(data.estado_id));
    }, [data.estado_id, cidades]);

    const handleCepChange = async (value: string) => {
        const raw = value.replace(/\D/g, '');
        let formatted = raw;
        if (raw.length > 5) {
            formatted = `${raw.slice(0, 5)}-${raw.slice(5, 8)}`;
        }
        setData(d => ({ ...d, cep: formatted }));
        setCepError('');

        if (raw.length === 8) {
            setIsFetchingCep(true);
            try {
                const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${raw}`);
                if (!response.ok) {
                    throw new Error('CEP não encontrado');
                }
                const resData = await response.json();

                const addressFields: any = {
                    cep: formatted,
                    cep_data: resData
                };

                let fullAddress = '';
                if (resData.street) fullAddress += resData.street;
                if (resData.neighborhood) {
                    fullAddress += (fullAddress ? ' - ' : '') + resData.neighborhood;
                }
                if (fullAddress) {
                    addressFields.endereco = fullAddress;
                }

                if (resData.state) {
                    const matchedEstado = estados.find(
                        e => e.sigla.toUpperCase() === resData.state.toUpperCase()
                    );
                    if (matchedEstado) {
                        addressFields.regiao_id = matchedEstado.regiaoId;
                        addressFields.estado_id = matchedEstado.id;

                        if (resData.city) {
                            const normalizeStr = (str: string) =>
                                str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                            const normalizedCityName = normalizeStr(resData.city);
                            const matchedCidade = cidades.find(
                                c => c.estadoId === matchedEstado.id && normalizeStr(c.nome) === normalizedCityName
                            );
                            if (matchedCidade) {
                                addressFields.cidade_id = matchedCidade.id;
                            } else {
                                addressFields.cidade_id = '';
                            }
                        } else {
                            addressFields.cidade_id = '';
                        }
                    } else {
                        addressFields.regiao_id = '';
                        addressFields.estado_id = '';
                        addressFields.cidade_id = '';
                    }
                }

                setData(d => ({
                    ...d,
                    ...addressFields
                }));
            } catch (err: any) {
                setCepError(err.message || 'Erro ao buscar CEP');
            } finally {
                setIsFetchingCep(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('administracao.hotel.update', { id: hotel.id }));
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title={`Editar ${hotel.nome}`}>
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('administracao.hotel.index')}
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Hotel</h1>
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
                            />
                            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <MapPin size={16} className="text-blue-500" />
                                CEP
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.cep}
                                    onChange={e => handleCepChange(e.target.value)}
                                    className={inputClasses}
                                    placeholder="00000-000"
                                    maxLength={9}
                                />
                                {isFetchingCep && (
                                    <span className="absolute right-3 top-3 text-xs text-gray-400 animate-pulse">
                                        Buscando...
                                    </span>
                                )}
                            </div>
                            {cepError && <p className="mt-1 text-xs text-red-500">{cepError}</p>}
                            {errors.cep && <p className="mt-1 text-xs text-red-500">{errors.cep}</p>}
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
                            />
                            {errors.diaria && <p className="mt-1 text-xs text-red-500">{errors.diaria}</p>}
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
                            />
                            {errors.endereco && <p className="mt-1 text-xs text-red-500">{errors.endereco}</p>}
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
                                    onChange={e => setData('cidade_id', Number(e.target.value))}
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
                            href={route('administracao.hotel.index')}
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
