import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    User as UserIcon,
    XCircle,
    History,
    Shield,
    Phone as PhoneIcon,
    CreditCard,
    Mail
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ModalData } from '@/components/Modal';
import CustomModal from '@/components/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import type { Auth, User, Role, PermissionType } from '@/types/auth';
import { useRoute } from 'ziggy-js';
import { formatarCPF, formatarTelefone, limparNaoNumericos } from '@/lib/masks';
import { schemaPerfil } from '@/lib/schemas';

interface Compra {
    id: string;
    valor_final: number;
    data_compra: string;
    status: string;
    oferta: {
        inicio: string;
        fim: string;
        pacote: {
            id: number;
            nome: string;
            fotos_do_pacote?: {
                fotos: { url: string }[];
            };
        };
        hotel: {
            cidade: {
                nome: string;
            };
        };
    };
}

interface Props {
    usuario: User;
    compras: Compra[];
    roles: Role[];
    permissions: PermissionType[];
    auth: Auth;
}

interface PerfilForm {
    nome: string;
    sobre_nome: string;
    email: string;
    cpf: string;
    telefone: string;
}

interface AcessoForm {
    role_id: number | string;
    permissions: number[];
}

export default function Detalhes({ usuario, compras, roles, permissions }: Props) {
    const route = useRoute();
    const [activeTab, setActiveTab] = useState<'perfil' | 'acesso' | 'historico'>('historico');
    const [statusFilter, setStatusFilter] = useState<string>('TODOS');
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const perfilForm = useForm<PerfilForm>({
        nome: usuario.nome,
        sobre_nome: usuario.sobre_nome,
        email: usuario.email,
        cpf: usuario.cpf || '',
        telefone: usuario.telefone || '',
    });

    useEffect(() => {
        perfilForm.transform((data) => ({
            ...data,
            cpf: limparNaoNumericos(data.cpf),
            telefone: limparNaoNumericos(data.telefone)
        }));
    }, [perfilForm.data.cpf, perfilForm.data.telefone]);

    const acessoForm = useForm<AcessoForm>({
        role_id: usuario.role?.id || '',
        permissions: usuario.permissions?.map(p => p.id) || []
    });

    const filteredPermissions = useMemo(() => {
        const selectedRole = roles.find(r => r.id === Number(acessoForm.data.role_id));
        if (!selectedRole) return [];
        return permissions.filter(p => selectedRole.is_staff || !p.is_staff);
    }, [acessoForm.data.role_id, permissions, roles]);

    const handleUpdatePerfil = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schemaPerfil.safeParse(perfilForm.data);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errs[issue.path[0].toString()] = issue.message;
                }
            });
            setZodErrors(errs);
            return;
        }

        setZodErrors({});
        perfilForm.put(route('administracao.usuario.perfil-update', { user: usuario.id }), {
            onSuccess: () => setModal({ show: true, mensagem: 'Perfil atualizado com sucesso!', url: null }),
        });
    };

    const handleUpdateAccess = (e: React.FormEvent) => {
        e.preventDefault();
        acessoForm.put(route('administracao.usuario.update-access', { user: usuario.id }), {
            onSuccess: () => setModal({ show: true, mensagem: 'Acessos sincronizados com sucesso!', url: null }),
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACEITO': return <CheckCircle size={14} />;
            case 'RECUSADO': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const handlePerfilChange = (campo: keyof PerfilForm, valor: string) => {
        const rawValue = limparNaoNumericos(valor);
        if (campo === 'cpf') {
            perfilForm.setData('cpf', rawValue.substring(0, 11));
        } else if (campo === 'telefone') {
            perfilForm.setData('telefone', rawValue.substring(0, 11));
        } else {
            perfilForm.setData(campo as any, valor);
        }
    };

    return (
        <AdminLayout title={`Detalhes: ${usuario.nome}`}>
            <Head title={`Detalhes: ${usuario.nome}`} />
            <>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link 
                                href={route('administracao.usuario.listar')}
                                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </Link>
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <UserIcon size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Usuário</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                usuario.role?.is_staff ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                                {usuario.role?.name || 'Cliente'}
                            </span>
                            {!usuario.is_valid && (
                                <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">
                                    Bloqueado
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-8">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-3xl font-bold border border-gray-200 mb-4">
                                        {usuario.nome.charAt(0)}
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">{usuario.nome} {usuario.sobre_nome}</h2>
                                    <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                                </div>

                                <div className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab('historico')}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            activeTab === 'historico' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <History size={18} />
                                        Histórico de Viagens
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('perfil')}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            activeTab === 'perfil' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <UserIcon size={18} />
                                        Dados Pessoais
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('acesso')}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            activeTab === 'acesso' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Shield size={18} />
                                        Controle de Acesso
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-9">
                            {activeTab === 'historico' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                <History size={18} className="text-blue-600" />
                                                Histórico de Reservas
                                            </h3>
                                            <div className="flex gap-2">
                                                {['TODOS', 'PENDENTE', 'ACEITO', 'RECUSADO'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => setStatusFilter(status)}
                                                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all border ${
                                                            statusFilter === status 
                                                                ? 'bg-gray-900 text-white border-gray-900' 
                                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {compras.length > 0 ? (
                                                compras.filter(c => statusFilter === 'TODOS' || c.status === statusFilter).map(compra => (
                                                    <div key={compra.id} className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                                                    <Calendar size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 text-sm">{compra.oferta.pacote.nome}</p>
                                                                    <p className="text-xs text-gray-500">{compra.oferta.hotel.cidade.nome} • {formatDate(compra.data_compra)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="font-bold text-sm text-gray-900">{formatCurrency(compra.valor_final)}</span>
                                                                <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                                    compra.status === 'ACEITO' ? 'bg-green-100 text-green-700' : 
                                                                    compra.status === 'RECUSADO' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                    {getStatusIcon(compra.status)}
                                                                    {compra.status}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-12 text-center text-gray-400 text-sm">
                                                    Nenhuma reserva encontrada.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'perfil' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Editar Perfil</h3>
                                    </div>
                                    <form onSubmit={handleUpdatePerfil} className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 uppercase">Nome</label>
                                                <input
                                                    type="text"
                                                    value={perfilForm.data.nome}
                                                    onChange={e => handlePerfilChange('nome', e.target.value)}
                                                    className={`w-full px-4 py-2 bg-white border ${zodErrors.nome || perfilForm.errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 text-sm`}
                                                />
                                                {(zodErrors.nome || perfilForm.errors.nome) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.nome || perfilForm.errors.nome}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 uppercase">Sobrenome</label>
                                                <input
                                                    type="text"
                                                    value={perfilForm.data.sobre_nome}
                                                    onChange={e => handlePerfilChange('sobre_nome', e.target.value)}
                                                    className={`w-full px-4 py-2 bg-white border ${zodErrors.sobre_nome || perfilForm.errors.sobre_nome ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 text-sm`}
                                                />
                                                {(zodErrors.sobre_nome || perfilForm.errors.sobre_nome) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.sobre_nome || perfilForm.errors.sobre_nome}</p>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" />
                                                    E-mail
                                                </label>
                                                <input
                                                    type="email"
                                                    value={perfilForm.data.email}
                                                    onChange={e => perfilForm.setData('email', e.target.value)}
                                                    className={`w-full px-4 py-2 bg-white border ${zodErrors.email || perfilForm.errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 text-sm`}
                                                />
                                                {(zodErrors.email || perfilForm.errors.email) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.email || perfilForm.errors.email}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                                                    <CreditCard size={14} className="text-gray-400" />
                                                    CPF
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formatarCPF(perfilForm.data.cpf)}
                                                    onChange={e => handlePerfilChange('cpf', e.target.value)}
                                                    className={`w-full px-4 py-2 bg-white border ${zodErrors.cpf || perfilForm.errors.cpf ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 text-sm`}
                                                />
                                                {(zodErrors.cpf || perfilForm.errors.cpf) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.cpf || perfilForm.errors.cpf}</p>}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                                                <PhoneIcon size={14} className="text-gray-400" />
                                                Telefone
                                            </label>
                                            <input
                                                type="text"
                                                value={formatarTelefone(perfilForm.data.telefone)}
                                                onChange={e => handlePerfilChange('telefone', e.target.value)}
                                                className={`w-full px-4 py-2 bg-white border ${zodErrors.telefone || perfilForm.errors.telefone ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 text-sm`}
                                            />
                                            {(zodErrors.telefone || perfilForm.errors.telefone) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.telefone || perfilForm.errors.telefone}</p>}
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={perfilForm.processing}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {perfilForm.processing ? 'Salvando...' : 'Salvar Alterações'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'acesso' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Controle de Acesso</h3>
                                    </div>
                                    <form onSubmit={handleUpdateAccess} className="p-6 space-y-8">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Cargo Selecionado</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {roles.filter(r => r.is_staff === usuario.role?.is_staff).map(role => (
                                                    <label
                                                        key={role.id}
                                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                            Number(acessoForm.data.role_id) === role.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-100'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-bold text-sm">{role.name}</span>
                                                            <input
                                                                type="radio"
                                                                value={role.id}
                                                                checked={Number(acessoForm.data.role_id) === role.id}
                                                                onChange={e => acessoForm.setData('role_id', e.target.value)}
                                                                className="text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-gray-500">{role.description}</p>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {filteredPermissions.length > 0 && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Permissões Diretas</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {filteredPermissions.map(permission => (
                                                        <button
                                                            key={permission.id}
                                                            type="button"
                                                            onClick={() => {
                                                                const current = acessoForm.data.permissions;
                                                                const updated = current.includes(permission.id)
                                                                    ? current.filter(id => id !== permission.id)
                                                                    : [...current, permission.id];
                                                                acessoForm.setData('permissions', updated);
                                                            }}
                                                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold border transition-all ${
                                                                acessoForm.data.permissions.includes(permission.id)
                                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
                                                            }`}
                                                        >
                                                            {permission.slug}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                                            <Shield size={18} className="text-amber-600 shrink-0" />
                                            <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
                                                Alterações de acesso entram em vigor imediatamente. Membros do Staff não podem ser promovidos a Administrador via interface por segurança.
                                            </p>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={acessoForm.processing}
                                                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                                            >
                                                Atualizar Acessos
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <CustomModal modalData={modal} setModal={setModal} />
            </>
        </AdminLayout>
    );
}
