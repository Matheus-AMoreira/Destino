import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { Camera, Save, X, Type, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface PacoteFotoData {
    id: number;
    nome: string;
    foto_capa: string | null;
    storage_type: 'local' | 'cloud';
    is_url: boolean;
    items: { id: number; caminho: string; is_url: boolean }[];
}

interface Props {
    pacoteFoto: PacoteFotoData;
}

export default function Edit({ pacoteFoto }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nome: pacoteFoto.nome,
        is_url: pacoteFoto.is_url,
        foto_capa: null as File | string | null,
    });

    const [preview, setPreview] = useState<string | null>(pacoteFoto.foto_capa);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto_capa', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setData('foto_capa', url);
        setPreview(url);
    };

    const toggleMediaType = (isUrl: boolean) => {
        setData(prev => ({
            ...prev,
            is_url: isUrl,
            foto_capa: null
        }));
        setPreview(null);
    };

    const handleAddSupportPhoto = (file: File | string, isUrl: boolean) => {
        const formData = new FormData();
        formData.append('foto', file);
        formData.append('is_url', isUrl ? '1' : '0');
        router.post(`/administracao/pacotedefoto/${pacoteFoto.id}/support`, formData);
    };

    const handleRemoveSupportPhoto = (itemId: number) => {
        if (confirm('Deseja remover esta foto?')) {
            router.delete(`/administracao/pacotedefoto/support/${itemId}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we are uploading a file, we use post and manually handle spoofing or just use the POST route defined
        post(`/administracao/pacotedefoto/editar/${pacoteFoto.id}`);
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title={`Editar ${pacoteFoto.nome}`}>
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/administracao/pacotedefoto/listar"
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Álbum</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <label className={labelClasses}>
                                <Type size={16} className="text-purple-500" />
                                Nome do Álbum
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
                                <Save size={16} className="text-purple-500" />
                                Local de Armazenamento
                            </label>
                            <div className={`mt-1 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-gray-600 font-medium uppercase text-sm`}>
                                {pacoteFoto.storage_type}
                            </div>
                            <p className="mt-1 text-[10px] text-gray-500 italic">O local de armazenamento não pode ser alterado após a criação.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>
                                <Upload size={16} className="text-orange-500" />
                                Tipo de Mídia (Capa)
                            </label>
                            <select
                                value={data.is_url ? 'url' : 'file'}
                                onChange={(e) => toggleMediaType(e.target.value === 'url')}
                                className={inputClasses}
                            >
                                <option value="file">Upload de Arquivo</option>
                                <option value="url">Link Externo (URL)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>
                            {data.is_url ? <Type size={16} className="text-purple-500" /> : <Upload size={16} className="text-purple-500" />}
                            {data.is_url ? 'URL da Foto de Capa' : 'Foto de Capa (Deixe vazio para manter a atual)'}
                        </label>

                        {data.is_url ? (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={typeof data.foto_capa === 'string' ? data.foto_capa : ''}
                                    onChange={handleUrlChange}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className={inputClasses}
                                />
                                {preview && (
                                    <div className="mt-4 relative h-48 w-full overflow-hidden rounded-xl border border-gray-200">
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-purple-400 relative">
                                {preview ? (
                                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setPreview(null); setData('foto_capa', null); }}
                                            className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white shadow-md z-10"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon size={48} className="mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm text-gray-500">Clique para selecionar uma nova foto</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    accept="image/*"
                                />
                            </div>
                        )}
                        {errors.foto_capa && <p className="mt-1 text-xs text-red-500">{errors.foto_capa}</p>}
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <div className="mb-4 flex items-center justify-between">
                            <label className={labelClasses}>
                                <ImageIcon size={16} className="text-purple-500" />
                                Fotos de Suporte
                            </label>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-gray-800"
                                        >
                                            <Upload size={14} />
                                            Upload
                                        </button>
                                        <input
                                            type="file"
                                            onChange={(e) => e.target.files?.[0] && handleAddSupportPhoto(e.target.files[0], false)}
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                            accept="image/*"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const url = prompt('Cole a URL da foto de suporte:');
                                            if (url) handleAddSupportPhoto(url, true);
                                        }}
                                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-purple-700"
                                    >
                                        <Plus size={14} />
                                        Link (URL)
                                    </button>
                                </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {pacoteFoto.items.map((item) => (
                                <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100">
                                    <img 
                                        src={item.caminho} 
                                        alt="Suporte" 
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSupportPhoto(item.id)}
                                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {pacoteFoto.items.length === 0 && (
                                <div className="col-span-full py-8 text-center text-sm text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                    Nenhuma foto de suporte adicionada.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/administracao/pacotedefoto/listar"
                            className="rounded-lg px-6 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-purple-700 disabled:opacity-50"
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
