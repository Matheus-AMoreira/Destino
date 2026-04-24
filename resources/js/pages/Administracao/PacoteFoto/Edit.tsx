import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Plus, Save, Type, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import Image from '@/components/Image';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface PhotoItem {
    id?: number;
    file: File | null;
    url: string;
    preview: string | null;
    is_url: boolean;
    deleted?: boolean;
}

interface PacoteFotoData {
    id: number;
    nome: string;
    foto_capa: string | null;
    storage_type: 'local' | 'cloud' | 'url';
    is_url: boolean;
    itens: { id: number; caminho: string; is_url: boolean }[];
}

interface Props {
    pacoteFoto: PacoteFotoData;
    isUploadAvailable: boolean;
}

export default function Edit({ pacoteFoto, isUploadAvailable }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST', // We use POST with _method spoofing if needed, but since it's defined as POST in routes for file uploads, we use POST
        nome: pacoteFoto.nome,
        foto_capa_file: null as File | null,
        foto_capa_url: pacoteFoto.is_url ? pacoteFoto.foto_capa || '' : '',
        is_url_capa: pacoteFoto.is_url,
        itens: (pacoteFoto.itens || []).map(item => ({
            id: item.id,
            file: null,
            url: item.is_url ? item.caminho : '',
            preview: item.caminho,
            is_url: item.is_url
        })) as PhotoItem[],
    });

    const [capaPreview, setCapaPreview] = useState<string | null>(pacoteFoto.foto_capa);

    const handleCapaFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            alert('O arquivo é muito grande! O limite é 20MB.');
            return;
        }
        setData((prev) => ({
            ...prev,
            foto_capa_file: file,
            foto_capa_url: '',
            is_url_capa: false,
        }));
        setCapaPreview(URL.createObjectURL(file));
    };

    const handleCapaUrl = (url: string) => {
        setData((prev) => ({
            ...prev,
            foto_capa_url: url,
            foto_capa_file: null,
            is_url_capa: true,
        }));
        setCapaPreview(url);
    };

    const addAuxiliaryPhoto = () => {
        setData('itens', [
            ...data.itens,
            { file: null, url: '', preview: null, is_url: false },
        ]);
    };

    const removeAuxiliaryPhoto = (index: number) => {
        const newItens = [...data.itens];
        const item = newItens[index];
        
        if (item.id) {
            // Mark for deletion on backend
            newItens[index] = { ...item, deleted: true };
        } else {
            // Just remove from list if it's new
            newItens.splice(index, 1);
        }
        setData('itens', newItens);
    };

    const updateAuxiliaryPhoto = (index: number, updates: Partial<PhotoItem>) => {
        const newItens = [...data.itens];
        newItens[index] = { ...newItens[index], ...updates };
        setData('itens', newItens);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('administracao.pacotedefoto.update', pacoteFoto.id));
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title={`Editar ${pacoteFoto.nome}`}>
            <div className="mx-auto max-w-4xl">
                {!isUploadAvailable && (
                    <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                        <p className="font-bold">Aviso:</p>
                        <p>O serviço de upload de imagens não está disponível no servidor. Use apenas links (URL).</p>
                    </div>
                )}

                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('administracao.pacotedefoto.listar')}
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Álbum</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                        <div className="max-w-md">
                            <label className={labelClasses}>
                                <Type size={16} className="text-purple-500" />
                                Nome do Álbum
                            </label>
                            <input
                                type="text"
                                value={data.nome}
                                onChange={(e) => setData('nome', e.target.value)}
                                className={inputClasses}
                                required
                            />
                            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                        </div>
                    </div>

                    {/* Main Photo (Cap) */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="text-purple-600" size={20} />
                            Imagem de Capa (Destaque)
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClasses}>Origem da Imagem</label>
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setData('is_url_capa', false)}
                                            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${!data.is_url_capa ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            disabled={!isUploadAvailable}
                                        >
                                            Upload de Arquivo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_url_capa', true)}
                                            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${data.is_url_capa ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            Link Externo (URL)
                                        </button>
                                    </div>
                                </div>

                                {data.is_url_capa ? (
                                    <div>
                                        <label className={labelClasses}>URL da Imagem</label>
                                        <input
                                            type="url"
                                            value={data.foto_capa_url}
                                            onChange={(e) => handleCapaUrl(e.target.value)}
                                            className={inputClasses}
                                            placeholder="https://exemplo.com/foto.jpg"
                                        />
                                    </div>
                                ) : (
                                    <div 
                                        className="relative group border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-purple-400 bg-purple-50/30 flex flex-col items-center justify-center cursor-pointer"
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-purple-500', 'bg-purple-50'); }}
                                        onDragLeave={(e) => { e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50'); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) handleCapaFile(file);
                                        }}
                                    >
                                        <Upload size={32} className="text-gray-400 mb-2 group-hover:text-purple-500 transition-colors" />
                                        <p className="text-sm text-gray-500 group-hover:text-purple-600">Clique ou arraste para alterar</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Deixe vazio para manter a atual</p>
                                        <input
                                            type="file"
                                            onChange={(e) => e.target.files?.[0] && handleCapaFile(e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />
                                    </div>
                                )}
                                {(errors.foto_capa_file || errors.foto_capa_url) && (
                                    <p className="mt-1 text-xs text-red-500">{errors.foto_capa_file || errors.foto_capa_url}</p>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <label className={`${labelClasses} mb-2 self-start`}>Prévia da Capa</label>
                                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-inner group">
                                    {capaPreview ? (
                                        <>
                                            <Image name={capaPreview} alt="Capa" style="h-full w-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => { setCapaPreview(null); setData('foto_capa_file', null); setData('foto_capa_url', ''); }}
                                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <ImageIcon size={64} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Auxiliary Photos */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Plus className="text-purple-600" size={20} />
                                Fotos Auxiliares
                            </h2>
                            <button
                                type="button"
                                onClick={addAuxiliaryPhoto}
                                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-gray-800"
                            >
                                <Plus size={14} />
                                Adicionar Foto
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.itens.filter(i => !i.deleted).map((item, index) => {
                                // Find real index in original data.itens for correct mapping
                                const realIndex = data.itens.findIndex(i => i === item);
                                return (
                                    <div key={item.id || `new-${index}`} className="group flex items-start gap-4 rounded-xl border border-gray-100 p-4 transition-all hover:bg-gray-50">
                                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                            {item.preview ? (
                                                <Image name={item.preview} alt="Aux" style="h-full w-full object-cover" noFallback={true} />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Origem</label>
                                                <div className="mt-1 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateAuxiliaryPhoto(realIndex, { is_url: false, file: null, url: '', preview: null })}
                                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!item.is_url ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                        disabled={!isUploadAvailable}
                                                    >
                                                        Upload
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateAuxiliaryPhoto(realIndex, { is_url: true, file: null, url: '', preview: null })}
                                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${item.is_url ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                    >
                                                        URL
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {item.is_url ? 'Link da Imagem' : 'Escolher Arquivo'}
                                                </label>
                                                {item.is_url ? (
                                                    <input
                                                        type="url"
                                                        value={item.url}
                                                        onChange={(e) => updateAuxiliaryPhoto(realIndex, { url: e.target.value, preview: e.target.value })}
                                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-purple-500"
                                                        placeholder="https://..."
                                                    />
                                                ) : (
                                                    <div className="mt-1 relative h-9">
                                                        <div className="absolute inset-0 rounded-lg border border-gray-300 bg-white flex items-center px-3 text-sm text-gray-500 overflow-hidden">
                                                            {item.file ? item.file.name : (item.id ? 'Manter atual' : 'Selecionar imagem...')}
                                                        </div>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    if (file.size > MAX_FILE_SIZE) {
                                                                        alert('Máx 20MB');
                                                                        return;
                                                                    }
                                                                    updateAuxiliaryPhoto(realIndex, { file, preview: URL.createObjectURL(file) });
                                                                }
                                                            }}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            accept="image/*"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeAuxiliaryPhoto(realIndex)}
                                            className="mt-6 p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                );
                            })}

                            {data.itens.filter(i => !i.deleted).length === 0 && (
                                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                    <p className="text-sm text-gray-400">Nenhuma foto auxiliar adicionada.</p>
                                    <button
                                        type="button"
                                        onClick={addAuxiliaryPhoto}
                                        className="mt-2 text-xs font-bold text-purple-600 hover:underline"
                                    >
                                        Adicionar agora
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href={route('administracao.pacotedefoto.listar')}
                            className="rounded-lg px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-10 py-3 font-bold text-white shadow-xl shadow-purple-200 transition-all hover:bg-purple-700 hover:scale-[1.02] disabled:opacity-50"
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
