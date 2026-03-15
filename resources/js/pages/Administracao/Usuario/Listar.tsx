import AdminLayout from '@/layouts/AdminLayout';
import { User, Auth } from '@/types/auth';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    UserCheck, 
    Lock, 
    Unlock, 
    History 
} from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    usuarios: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        termo: string;
    };
    auth: Auth;
}

export default function Listar({ usuarios, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.termo || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('administracao.usuario.listar'), { termo: searchTerm }, { preserveState: true });
    };

    const handleAprovar = (id: string) => {
        if (confirm('Deseja aprovar este usuário manualmente?')) {
            router.post(route('administracao.usuario.aprovar', { user: id }));
        }
    };

    const handleToggleBlock = (id: string) => {
        router.post(route('administracao.usuario.toggle-block', { user: id }));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMINISTRADOR': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'FUNCIONARIO': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AdminLayout title="Gerenciamento de Usuários">
            <Head title="Gerenciamento de Usuários" />

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                    <p className="text-gray-500 mt-1">Gerencie permissões, valide contas e monitore atividades.</p>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou CPF..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Usuário</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contato / CPF</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Nível</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usuarios.data.length > 0 ? (
                                usuarios.data.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                                    {usuario.nome.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-tight">{usuario.nome} {usuario.sobre_nome}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Desde {formatDate(usuario.created_at)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{usuario.email}</p>
                                            <p className="text-xs text-gray-500">{usuario.cpf}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeColor(usuario.role)}`}>
                                                {usuario.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                {!usuario.email_verified_at ? (
                                                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 rounded-lg">Aguardando Verif.</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 rounded-lg">Verificado</span>
                                                )}
                                                {!usuario.is_valid && (
                                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 rounded-lg">Bloqueado</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('administracao.usuario.show', { user: usuario.id })}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Inspecionar e Editar Detalhes"
                                                >
                                                    <History size={18} />
                                                </Link>
                                                {!usuario.email_verified_at && (
                                                    <button
                                                        onClick={() => handleAprovar(usuario.id)}
                                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Validar Manualmente"
                                                    >
                                                        <UserCheck size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleToggleBlock(usuario.id)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        usuario.is_valid 
                                                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                                                            : 'text-red-600 bg-red-50 hover:bg-red-100'
                                                    }`}
                                                    title={usuario.is_valid ? "Bloquear Acesso" : "Desbloquear Acesso"}
                                                >
                                                    {usuario.is_valid ? <Lock size={18} /> : <Unlock size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <SearchX className="text-gray-200" size={48} />
                                            <p className="text-gray-400 font-medium">Nenhum usuário encontrado para sua busca.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {usuarios.last_page > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
                        {usuarios.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    link.active 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                        : 'text-gray-500 hover:bg-white hover:text-blue-600'
                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function SearchX({ className, size }: { className?: string, size?: number }) {
    return (
        <div className={className}>
            <Search size={size} strokeWidth={1} />
        </div>
    );
}
