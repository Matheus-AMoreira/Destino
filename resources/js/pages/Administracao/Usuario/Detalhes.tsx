import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    History,
    Mail,
    Phone as PhoneIcon,
    Shield,
    User as UserIcon,
    XCircle,
} from 'lucide-react';
import { useMemo } from 'react';
import type { ModalData } from '@/components/Modal';
import CustomModal from '@/components/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import { formatarCPF, formatarTelefone } from '@/lib/masks';
import type { Auth, PermissionType, Role, User } from '@/types/auth';
import { useUsuarioDetalhes } from '@/services/identidade/usuarioService';
import { index as indexUsuario } from '@/routes/administracao/usuario';

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
    canManageRole: boolean;
    canManagePermissions: boolean;
    canEditProfile: boolean;
}

interface PerfilForm {
    nome: string;
    sobre_nome: string;
    email: string;
    cpf: string;
    telefone: string;
}

export default function Detalhes({
    usuario,
    compras = [],
    roles,
    permissions,
    auth,
    canManageRole,
    canManagePermissions,
    canEditProfile,
}: Props) {
    const canManageAccess = canManageRole || canManagePermissions;

    const {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        modal,
        setModal,
        zodErrors,
        perfilForm,
        acessoForm,
        handleUpdatePerfil,
        handleUpdateAccess,
    } = useUsuarioDetalhes(usuario);

    const filteredPermissions = useMemo(() => {
        const selectedRole = roles.find(
            (r) => r.id === Number(acessoForm.data.role_id),
        );
        if (!selectedRole) return [];
        return permissions.filter((p) => selectedRole.is_staff || !p.is_staff);
    }, [acessoForm.data.role_id, permissions, roles]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACEITO':
                return <CheckCircle size={14} />;
            case 'RECUSADO':
                return <XCircle size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    const handlePerfilChange = (campo: keyof PerfilForm, valor: string) => {
        const rawValue = valor.replace(/\D/g, '');
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
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={indexUsuario().url}
                                className="p-3 bg-white text-gray-400 hover:text-blue-600 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                    Detalhes do Usuário
                                </h1>
                                <p className="text-gray-500 font-medium text-sm">
                                    Gerencie informações e permissões de{' '}
                                    {usuario.nome}.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                                    usuario.role?.is_staff
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                                        : 'bg-gray-100 text-gray-700 border-gray-200'
                                }`}
                            >
                                {usuario.role?.name || 'Cliente'}
                            </span>
                            {!usuario.is_valid && (
                                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-red-600 text-white border border-red-600 shadow-lg shadow-red-100">
                                    Bloqueado
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar */}{' '}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-100/50 p-8 sticky top-8">
                                <div className="flex flex-col items-center text-center mb-8">
                                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-4xl font-black border-4 border-white shadow-xl mb-4">
                                        {usuario.nome.charAt(0)}
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900">
                                        {usuario.nome} {usuario.sobre_nome}
                                    </h2>
                                    <p className="text-sm text-gray-400 font-bold mt-1 tracking-tight">
                                        {usuario.email}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() =>
                                            setActiveTab('historico')
                                        }
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                            activeTab === 'historico'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                                        }`}
                                    >
                                        <History size={20} />
                                        <span className="text-sm">
                                            Histórico
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('perfil')}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                            activeTab === 'perfil'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                                        }`}
                                    >
                                        <UserIcon size={20} />
                                        <span className="text-sm">Perfil</span>
                                    </button>
                                    {canManageAccess && (
                                        <button
                                            onClick={() =>
                                                setActiveTab('acesso')
                                            }
                                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                                activeTab === 'acesso'
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                                            }`}
                                        >
                                            <Shield size={20} />
                                            <span className="text-sm">
                                                Acessos
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Main Content */}
                        <div className="lg:col-span-9">
                            {activeTab === 'historico' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-100/50 p-10">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                                    Histórico de Reservas
                                                </h3>
                                                <p className="text-gray-500 font-medium text-sm">
                                                    Acompanhe as viagens
                                                    realizadas pelo usuário.
                                                </p>
                                            </div>
                                            <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
                                                {[
                                                    'TODOS',
                                                    'PENDENTE',
                                                    'ACEITO',
                                                    'RECUSADO',
                                                ].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() =>
                                                            setStatusFilter(
                                                                status,
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                            statusFilter ===
                                                            status
                                                                ? 'bg-white text-gray-900 shadow-md'
                                                                : 'text-gray-500 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {compras.length > 0 ? (
                                                compras
                                                    .filter(
                                                        (c) =>
                                                            statusFilter ===
                                                                'TODOS' ||
                                                            c.status ===
                                                                statusFilter,
                                                    )
                                                    .map((compra) => (
                                                        <div
                                                            key={compra.id}
                                                            className="p-6 bg-gray-50/50 border border-transparent rounded-3xl hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all group"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-6">
                                                                    <div className="bg-white p-4 rounded-2xl text-blue-600 shadow-sm group-hover:shadow-md transition-all">
                                                                        <Calendar
                                                                            size={
                                                                                24
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-gray-900 text-lg tracking-tight">
                                                                            {
                                                                                compra
                                                                                    .oferta
                                                                                    .pacote
                                                                                    .nome
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-500 font-bold">
                                                                            {
                                                                                compra
                                                                                    .oferta
                                                                                    .hotel
                                                                                    .cidade
                                                                                    .nome
                                                                            }{' '}
                                                                            •{' '}
                                                                            {formatDate(
                                                                                compra.data_compra,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-6">
                                                                    <span className="font-black text-xl text-gray-900 tracking-tighter">
                                                                        {formatCurrency(
                                                                            compra.valor_final,
                                                                        )}
                                                                    </span>
                                                                    <div
                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                                            compra.status ===
                                                                            'ACEITO'
                                                                                ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                                                                                : compra.status ===
                                                                                    'RECUSADO'
                                                                                  ? 'bg-red-600 text-white shadow-lg shadow-red-100'
                                                                                  : 'bg-amber-500 text-white shadow-lg shadow-amber-100'
                                                                        }`}
                                                                    >
                                                                        {getStatusIcon(
                                                                            compra.status,
                                                                        )}
                                                                        {
                                                                            compra.status
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="py-20 text-center text-gray-400 font-bold text-lg">
                                                    Nenhuma reserva encontrada.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'perfil' && (
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-100/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-gray-50/50 px-10 py-8 border-b border-gray-100">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                            Dados Pessoais
                                        </h3>
                                        <p className="text-gray-500 font-medium text-sm">
                                            Atualize as informações de
                                            identificação do usuário.
                                        </p>
                                    </div>
                                    <form
                                        onSubmit={handleUpdatePerfil}
                                        className="p-10 space-y-10"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                                    Nome
                                                </label>
                                                <input
                                                    type="text"
                                                    value={perfilForm.data.nome}
                                                    onChange={(e) =>
                                                        handlePerfilChange(
                                                            'nome',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900 text-lg"
                                                />
                                                {(zodErrors.nome ||
                                                    perfilForm.errors.nome) && (
                                                    <p className="text-red-500 text-xs font-bold ml-4">
                                                        {zodErrors.nome ||
                                                            perfilForm.errors
                                                                .nome}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                                    Sobrenome
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        perfilForm.data
                                                            .sobre_nome
                                                    }
                                                    onChange={(e) =>
                                                        handlePerfilChange(
                                                            'sobre_nome',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900 text-lg"
                                                />
                                                {(zodErrors.sobre_nome ||
                                                    perfilForm.errors
                                                        .sobre_nome) && (
                                                    <p className="text-red-500 text-xs font-bold ml-4">
                                                        {zodErrors.sobre_nome ||
                                                            perfilForm.errors
                                                                .sobre_nome}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                                    <Mail size={14} />
                                                    E-mail
                                                </label>
                                                <input
                                                    type="email"
                                                    value={
                                                        perfilForm.data.email
                                                    }
                                                    onChange={(e) =>
                                                        perfilForm.setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900 text-lg"
                                                />
                                                {(zodErrors.email ||
                                                    perfilForm.errors
                                                        .email) && (
                                                    <p className="text-red-500 text-xs font-bold ml-4">
                                                        {zodErrors.email ||
                                                            perfilForm.errors
                                                                .email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                                    <CreditCard size={14} />
                                                    CPF
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formatarCPF(
                                                        perfilForm.data.cpf,
                                                    )}
                                                    onChange={(e) =>
                                                        handlePerfilChange(
                                                            'cpf',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Digite o CPF completo para alterar"
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900 text-lg"
                                                />
                                                {(zodErrors.cpf ||
                                                    perfilForm.errors.cpf) && (
                                                    <p className="text-red-500 text-xs font-bold ml-4">
                                                        {zodErrors.cpf ||
                                                            perfilForm.errors
                                                                .cpf}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                                <PhoneIcon size={14} />
                                                Telefone
                                            </label>
                                            <input
                                                type="text"
                                                value={formatarTelefone(
                                                    perfilForm.data.telefone,
                                                )}
                                                onChange={(e) =>
                                                    handlePerfilChange(
                                                        'telefone',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900 text-lg"
                                            />
                                            {(zodErrors.telefone ||
                                                perfilForm.errors.telefone) && (
                                                <p className="text-red-500 text-xs font-bold ml-4">
                                                    {zodErrors.telefone ||
                                                        perfilForm.errors
                                                            .telefone}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={
                                                    perfilForm.processing ||
                                                    !canEditProfile
                                                }
                                                className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:scale-95"
                                            >
                                                {perfilForm.processing
                                                    ? 'Salvando...'
                                                    : 'Salvar Alterações'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'acesso' && (
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-100/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-gray-50/50 px-10 py-8 border-b border-gray-100">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                            Controle de Acesso
                                        </h3>
                                        <p className="text-gray-500 font-medium text-sm">
                                            Gerencie o cargo e as permissões
                                            individuais.
                                        </p>
                                    </div>
                                    <form
                                        onSubmit={handleUpdateAccess}
                                        className="p-10 space-y-12"
                                    >
                                        {canManageRole && (
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 block mb-6">
                                                    Cargo Atribuído
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {roles
                                                        .filter(
                                                            (r) =>
                                                                r.name !==
                                                                'ADMINISTRADOR',
                                                        )
                                                        .map((role) => (
                                                            <label
                                                                key={role.id}
                                                                className={`p-6 border-2 rounded-3xl cursor-pointer transition-all ${
                                                                    Number(
                                                                        acessoForm
                                                                            .data
                                                                            .role_id,
                                                                    ) ===
                                                                    role.id
                                                                        ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                                                                        : 'border-gray-50 hover:border-blue-100 hover:bg-gray-50/50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="font-black text-lg text-gray-900">
                                                                        {
                                                                            role.name
                                                                        }
                                                                    </span>
                                                                    <input
                                                                        type="radio"
                                                                        value={
                                                                            role.id
                                                                        }
                                                                        checked={
                                                                            Number(
                                                                                acessoForm
                                                                                    .data
                                                                                    .role_id,
                                                                            ) ===
                                                                            role.id
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            acessoForm.setData(
                                                                                'role_id',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-600"
                                                                    />
                                                                </div>
                                                                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                                                    {
                                                                        role.description
                                                                    }
                                                                </p>
                                                            </label>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {canManagePermissions &&
                                            filteredPermissions.length > 0 && (
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 block mb-6">
                                                        Permissões Diretas
                                                    </label>
                                                    <div className="flex flex-wrap gap-3">
                                                        {filteredPermissions.map(
                                                            (permission) => (
                                                                <button
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const current =
                                                                            acessoForm
                                                                                .data
                                                                                .permissions;
                                                                        const updated =
                                                                            current.includes(
                                                                                permission.id,
                                                                            )
                                                                                ? current.filter(
                                                                                      (
                                                                                          id,
                                                                                      ) =>
                                                                                          id !==
                                                                                          permission.id,
                                                                                  )
                                                                                : [
                                                                                      ...current,
                                                                                      permission.id,
                                                                                  ];
                                                                        acessoForm.setData(
                                                                            'permissions',
                                                                            updated,
                                                                        );
                                                                    }}
                                                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                                                        acessoForm.data.permissions.includes(
                                                                            permission.id,
                                                                        )
                                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100'
                                                                            : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600'
                                                                    }`}
                                                                >
                                                                    {
                                                                        permission.slug
                                                                    }
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex gap-4">
                                            <Shield
                                                size={24}
                                                className="text-amber-500 shrink-0"
                                            />
                                            <p className="text-xs font-bold text-amber-900 leading-relaxed">
                                                Atenção: Alterações de acesso
                                                entram em vigor imediatamente.
                                                Membros do Staff não podem ser
                                                promovidos a Administrador via
                                                interface por motivos de
                                                segurança crítica.
                                            </p>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={acessoForm.processing}
                                                className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:scale-95"
                                            >
                                                {acessoForm.processing
                                                    ? 'Sincronizando...'
                                                    : 'Atualizar Acessos'}
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
