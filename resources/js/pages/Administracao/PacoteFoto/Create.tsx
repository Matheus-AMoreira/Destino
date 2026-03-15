import { Link, useForm } from '@inertiajs/react';
import { Save, X, Type, Upload, Image as ImageIcon } from 'lucide-react';
import type { ChangeEvent, DragEvent } from 'react';
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export default function Create() {
    const [isDragging, setIsDragging] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        storage_type: 'local' as 'local' | 'cloud',
        is_url: false,
        foto_capa: null as File | string | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];

        if (file.size > MAX_FILE_SIZE) {
            alert(`O arquivo é muito grande! O limite é ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
            return;
        }

        setData('foto_capa', file);
        setPreview(URL.createObjectURL(file));
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);

        handleFiles(e.dataTransfer.files);
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post('/administracao/pacotedefoto/registrar');
    };

    const inputClasses =
        'mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none';
    const labelClasses =
        'flex items-center gap-2 text-sm font-semibold text-gray-700';

    return (
        <AdminLayout title="Novo Álbum de Fotos">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/administracao/pacotedefoto/listar"
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Novo Álbum
                        </h1>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className={labelClasses}>
                                <Type size={16} className="text-purple-500" />
                                Nome do Álbum
                            </label>
                            <input
                                type="text"
                                value={data.nome}
                                onChange={(e) =>
                                    setData('nome', e.target.value)
                                }
                                className={inputClasses}
                                placeholder="Ex: Praia de Copacabana"
                            />
                            {errors.nome && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.nome}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <Save size={16} className="text-purple-500" />
                                Local de Armazenamento
                            </label>
                            <select
                                value={data.storage_type}
                                onChange={(e) =>
                                    setData(
                                        'storage_type',
                                        e.target.value as 'local' | 'cloud',
                                    )
                                }
                                className={inputClasses}
                            >
                                <option value="local">Local (Servidor)</option>
                                <option value="cloud">Nuvem (AWS S3)</option>
                            </select>
                            {errors.storage_type && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.storage_type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <Upload size={16} className="text-purple-500" />
                            Foto de Capa
                        </label>
                        <label
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className="${isDragging ? 'border-purple-500 scale-[1.02]' : 'border-gray-300 hover:border-purple-400' }` mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-purple-50 p-8 transition-colors hover:border-purple-400"
                        >
                            {preview ? (
                                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 z-20 rounded-full bg-red-600 p-1 text-white shadow-lg hover:bg-red-700"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setPreview(null);
                                            setData('foto_capa', null);
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="pointer-events-none text-center">
                                    <ImageIcon
                                        size={48}
                                        className="mx-auto mb-2 text-gray-300"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {isDragging
                                            ? 'Solte agora!'
                                            : 'Clique ou arraste uma foto'}
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="opacity-0"
                                accept="image/*"
                            />
                        </label>
                        {errors.foto_capa && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.foto_capa}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/administracao/pacotedefoto/listar"
                            className="rounded-lg px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-purple-700 disabled:opacity-50"
                        >
                            <Save size={20} />
                            <span>
                                {processing ? 'Salvando...' : 'Salvar Álbum'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
