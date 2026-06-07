import { useForm, router } from '@inertiajs/react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { store, update, destroy, index } from '@/routes/administracao/hotel';
import { obterDadosCep } from '../shared/cepService';

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
            };
        };
    };
}

export function useHotelForm(
    estados: Estado[],
    cidades: Cidade[],
    hotel?: HotelData,
) {
    const isEdit = !!hotel;

    const { data, setData, post, put, processing, errors } = useForm({
        nome: hotel?.nome || '',
        endereco: hotel?.endereco || '',
        diaria: hotel?.diaria || 0,
        cidade_id: (hotel?.cidade_id || '') as string | number,
        regiao_id: (hotel?.cidade?.estado?.regiao?.id || '') as string | number,
        estado_id: (hotel?.cidade?.estado?.id || '') as string | number,
        cep: hotel?.cep || '',
        cep_data: hotel?.cep_data || null,
    });

    const [isFetchingCep, setIsFetchingCep] = useState(false);
    const [cepError, setCepError] = useState('');

    const filteredEstados = useMemo(() => {
        if (!data.regiao_id) return [];
        return estados.filter((e) => e.regiao_id === Number(data.regiao_id));
    }, [data.regiao_id, estados]);

    const filteredCidades = useMemo(() => {
        if (!data.estado_id) return [];
        return cidades.filter((c) => c.estado_id === Number(data.estado_id));
    }, [data.estado_id, cidades]);

    const handleCepChange = async (value: string) => {
        const raw = value.replace(/\D/g, '');
        let formatted = raw;
        if (raw.length > 5) {
            formatted = `${raw.slice(0, 5)}-${raw.slice(5, 8)}`;
        }
        setData((d) => ({ ...d, cep: formatted }));
        setCepError('');

        if (raw.length === 8) {
            setIsFetchingCep(true);
            try {
                const resData = await obterDadosCep(raw);

                const addressFields: any = {
                    cep: formatted,
                    cep_data: resData,
                };

                let fullAddress = '';
                if (resData.street) fullAddress += resData.street;
                if (resData.neighborhood) {
                    fullAddress +=
                        (fullAddress ? ' - ' : '') + resData.neighborhood;
                }
                if (fullAddress) {
                    addressFields.endereco = fullAddress;
                }

                if (resData.state) {
                    const matchedEstado = estados.find(
                        (e) =>
                            e.sigla.toUpperCase() ===
                            resData.state.toUpperCase(),
                    );
                    if (matchedEstado) {
                        addressFields.regiao_id = matchedEstado.regiao_id;
                        addressFields.estado_id = matchedEstado.id;

                        if (resData.city) {
                            const normalizeStr = (str: string) =>
                                str
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')
                                    .toLowerCase();

                            const normalizedCityName = normalizeStr(
                                resData.city,
                            );
                            const matchedCidade = cidades.find(
                                (c) =>
                                    c.estado_id === matchedEstado.id &&
                                    normalizeStr(c.nome) === normalizedCityName,
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

                setData((d) => ({
                    ...d,
                    ...addressFields,
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
        if (isEdit && hotel) {
            put(update({ id: hotel.id }).url);
        } else {
            post(store().url);
        }
    };

    return {
        data,
        setData,
        processing,
        errors,
        isFetchingCep,
        cepError,
        filteredEstados,
        filteredCidades,
        handleCepChange,
        handleSubmit,
    };
}

export function deletarHotel(id: number, onConfirm?: () => boolean) {
    const shouldDelete = onConfirm
        ? onConfirm()
        : confirm('Deseja excluir este hotel?');
    if (shouldDelete) {
        router.delete(destroy({ id }).url);
    }
}

export function useHotelList(initialTermo = '') {
    const [termo, setTermo] = useState(initialTermo);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index().url, { q: termo }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        deletarHotel(id);
    };

    return {
        termo,
        setTermo,
        handleSearch,
        handleDelete,
    };
}
