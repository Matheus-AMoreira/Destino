import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { Package, Save, X, Type, FileText, User, Image as ImageIcon } from 'lucide-react';
import React from 'react';

interface Funcionario {
    id: string;
    nome: string;
}

interface PacoteFoto {
    id: number;
    nome: string;
}

interface Props {
    funcionarios: Funcionario[];
    pacoteFotos: PacoteFoto[];
}

export default function Create({ funcionarios, pacoteFotos }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        descricao: '',
        funcionario_id: '',
        pacote_foto_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/administracao/pacote/registrar');
    };

    const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700";

    return (
        <AdminLayout title="Novo Pacote">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/administracao/pacote/listar"
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Novo Pacote</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div>
                        <label className={labelClasses}>
                            <Type size={16} className="text-orange-500" />
                            Nome do Pacote
                        </label>
                        <input
                            type="text"
                            value={data.nome}
                            onChange={e => setData('nome', e.target.value)}
                            className={inputClasses}
                            placeholder="Ex: Primavera em Paris"
                        />
                        {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <FileText size={16} className="text-orange-500" />
                            Descrição
                        </label>
                        <textarea
                            value={data.descricao}
                            onChange={e => setData('descricao', e.target.value)}
                            className={`${inputClasses} resize-none`}
                            rows={4}
                            placeholder="Descreva o que este pacote oferece..."
                        />
                        {errors.descricao && <p className="mt-1 text-xs text-red-500">{errors.descricao}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className={labelClasses}>
                                <User size={16} className="text-orange-500" />
                                Responsável
                            </label>
                            <select
                                value={data.funcionario_id}
                                onChange={e => setData('funcionario_id', e.target.value)}
                                className={inputClasses}
                            >
                                <option value="">Selecione...</option>
                                {funcionarios.map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}
                            </select>
                            {errors.funcionario_id && <p className="mt-1 text-xs text-red-500">{errors.funcionario_id}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <ImageIcon size={16} className="text-orange-500" />
                                Álbum de Fotos
                            </label>
                            <select
                                value={data.pacote_foto_id}
                                onChange={e => setData('pacote_foto_id', e.target.value)}
                                className={inputClasses}
                            >
                                <option value="">Nenhum</option>
                                {pacoteFotos.map(pf => (
                                    <option key={pf.id} value={pf.id}>{pf.nome}</option>
                                ))}
                            </select>
                            {errors.pacote_foto_id && <p className="mt-1 text-xs text-red-500">{errors.pacote_foto_id}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/administracao/pacote/listar"
                            className="rounded-lg px-6 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-orange-600 px-8 py-2 font-bold text-white shadow-lg transition-all hover:bg-orange-700 disabled:opacity-50"
                        >
                            <Save size={20} />
                            <span>{processing ? 'Salvando...' : 'Salvar Pacote'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
