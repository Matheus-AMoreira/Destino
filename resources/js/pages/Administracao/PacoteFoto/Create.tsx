import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { Camera, Save, X, Type, Upload, Image as ImageIcon } from 'lucide-react';
import React, { useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        foto_do_pacote: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto_do_pacote', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/administracao/pacotedefoto/registrar');
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title="Novo Álbum de Fotos">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/administracao/pacotedefoto/listar"
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Novo Álbum</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
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
                            placeholder="Ex: Praia de Copacabana"
                        />
                        {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <Upload size={16} className="text-purple-500" />
                            Foto de Capa
                        </label>
                        <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-purple-400">
                            {preview ? (
                                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); setData('foto_do_pacote', null); }}
                                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white shadow-md"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <ImageIcon size={48} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm text-gray-500">Clique para selecionar ou arraste uma foto</p>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                accept="image/*"
                            />
                        </div>
                        {errors.foto_do_pacote && <p className="mt-1 text-xs text-red-500">{errors.foto_do_pacote}</p>}
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
                            <span>{processing ? 'Salvando...' : 'Salvar Álbum'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
