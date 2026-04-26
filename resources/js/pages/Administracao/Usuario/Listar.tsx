import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    AlertCircle,
    CheckCircle,
    Clock,
    Eye, 
    Filter,
    Plus,
    Search,
    User as UserIcon,
    ArrowRight,
    Shield,
    Trash2,
    Lock,
    Unlock,
    Send,
    UserCheck,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ModalData } from '@/components/Modal';
import CustomModal from '@/components/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import type { Auth, User, Role, PermissionType } from '@/types/auth';
import { useRoute } from 'ziggy-js';

interface UsuariosPaginados {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
    links: any[];
}

interface Props {
    usuarios: UsuariosPaginados;
    filters: {
        termo: string;
        tab: string;
    };
    roles: Role[];
    permissions: PermissionType[];
    auth: Auth;
}

export default function Listar({ usuarios, filters, auth }: Props) {
    const route = useRoute();
    const [termo, setTermo] = useState(filters.termo || '');
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('administracao.usuario.listar'), { 
            termo, 
            tab: filters.tab 
        }, { preserveState: true });
    };

    const handleTabChange = (newTab: string) => {
        router.get(route('administracao.usuario.listar'), { 
            termo, 
            tab: newTab 
        }, { preserveState: true });
    };

    const handleResendInvitation = (id: string) => {
        router.post(route('administracao.usuario.resend-invitation', { user: id }), {}, {
            onSuccess: () => setModal({ show: true, mensagem: 'Novo convite enviado!', url: null })
        });
    };

    const handleToggleBlock = (id: string) => {
        router.post(route('administracao.usuario.toggle-block', { user: id }), {}, {
            onSuccess: () => setModal({ show: true, mensagem: 'Status do usuário atualizado.', url: null })
        });
    };

    const handleAprovar = (id: string) => {
        router.post(route('administracao.usuario.aprovar', { user: id }), {}, {
            onSuccess: () => setModal({ show: true, mensagem: 'Usuário aprovado com sucesso!', url: null })
        });
    };

    const handleDelete = (id: string) => {
        router.delete(route('administracao.usuario.destroy', { user: id }), {
            onSuccess: () => setModal({ show: true, mensagem: 'Usuário removido.', url: null })
        });
    };

    return (
        <AdminLayout title="Gerenciar Usuários">
            <Head title="Gerenciar Usuários" />

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
                        <Users size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
                </div>

                <Link
                    href={route('administracao.usuario.registrar')}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                    <Plus size={18} />
                    Novo Funcionário
                </Link>
            </div>

            {/* Abas de Navegação */}
            <div className="mb-6 flex border-b border-gray-200">
                <button
                    onClick={() => handleTabChange('funcionarios')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                        filters.tab === 'funcionarios' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Funcionários (Staff)
                </button>
                <button
                    onClick={() => handleTabChange('clientes')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                        filters.tab === 'clientes' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Clientes (Site)
                </button>
            </div>

            {/* Barra de Filtros */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, e-mail ou CPF..."
                        value={termo}
                        onChange={(e) => setTermo(e.target.value)}
                        className="w-full rounded-lg border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </form>
                
                <div className="text-xs text-gray-400 font-medium">
                    Exibindo {usuarios.data.length} de {usuarios.total} registros
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50 text-left">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Usuário</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cargo</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usuarios.data.length > 0 ? (
                                usuarios.data.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                                    {usuario.nome.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {usuario.nome} {usuario.sobre_nome}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{usuario.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                                usuario.role?.name === 'ADMINISTRADOR' 
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                                {usuario.role?.name || 'Cliente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {usuario.is_valid ? (
                                                <div className="flex items-center gap-1.5 text-green-600">
                                                    <CheckCircle size={14} />
                                                    <span className="text-[10px] font-bold uppercase">Ativo</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-500">
                                                    <AlertCircle size={14} />
                                                    <span className="text-[10px] font-bold uppercase">Pendente</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('administracao.usuario.show', { user: usuario.id })}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Ver Detalhes"
                                                >
                                                    <Eye size={18} />
                                                </Link>

                                                {/* Botões contextuais baseados no status e papel */}
                                                {!usuario.is_valid && usuario.role?.is_staff && (
                                                    <button
                                                        onClick={() => handleResendInvitation(usuario.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100"
                                                        title="Reenviar Convite"
                                                    >
                                                        <Send size={16} />
                                                    </button>
                                                )}

                                                {!usuario.is_valid && !usuario.role?.is_staff && (
                                                    <button
                                                        onClick={() => handleAprovar(usuario.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-gray-100"
                                                        title="Validar Conta"
                                                    >
                                                        <UserCheck size={16} />
                                                    </button>
                                                )}
                                                
                                                <button
                                                    onClick={() => handleToggleBlock(usuario.id)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
                                                    title={usuario.is_valid ? 'Suspender' : 'Liberar'}
                                                >
                                                    {usuario.is_valid ? <Lock size={16} /> : <Unlock size={16} />}
                                                </button>

                                                {!usuario.role?.is_staff && (
                                                    <button
                                                        onClick={() => setModal({
                                                            show: true,
                                                            mensagem: 'Tem certeza que deseja excluir este cliente?',
                                                            url: null,
                                                            method: 'DELETE',
                                                            action: () => handleDelete(usuario.id)
                                                        })}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Search size={48} className="opacity-20" />
                                            <p className="text-sm font-medium">Nenhum {filters.tab === 'funcionarios' ? 'funcionário' : 'cliente'} encontrado.</p>
                                            {termo && <p className="text-xs">Tente mudar o termo da busca: "{termo}"</p>}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação Simples */}
                {usuarios.last_page > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex gap-2">
                            {usuarios.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                                        link.active 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CustomModal modalData={modal} setModal={setModal} />
        </AdminLayout>
    );
}
