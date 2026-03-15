import AdminLayout from '@/layouts/AdminLayout';
import { User, Auth } from '@/types/auth';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    Calendar,
    MapPin,
    CreditCard,
    X,
    CheckCircle2,
    Lock,
    Unlock,
    ShieldCheck,
    User as UserIcon,
    ArrowLeft,
    Clock,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import CustomModal, { ModalData } from '@/components/Modal';

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
    roles: string[];
    authorities: string[];
    auth: Auth;
}

export default function Detalhes({ usuario, compras, roles, authorities }: Props) {
    const [activeTab, setActiveTab] = useState<'perfil' | 'acesso' | 'historico'>('historico');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('TODOS');
    const [expandedPackages, setExpandedPackages] = useState<Record<number, boolean>>({});
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    // Form para Perfil
    const perfilForm = useForm({
        nome: usuario.nome as any,
        sobre_nome: usuario.sobre_nome as any,
        email: usuario.email as any,
        cpf: (usuario.cpf as any) || '',
    });

    // Form para Acesso
    const acessoForm = useForm({
        role: usuario.role,
        authorities: (usuario.authorities as string[]) || []
    });

    const handleUpdatePerfil = (e: React.FormEvent) => {
        e.preventDefault();
        perfilForm.put(route('administracao.usuario.perfil-update', { user: usuario.id }), {
            onSuccess: () => setModal({ show: true, mensagem: 'Perfil atualizado com sucesso!', url: null }),
            onError: (err) => setModal({ show: true, mensagem: Object.values(err).join('\n'), url: null })
        });
    };

    const handleUpdateAccess = (e: React.FormEvent) => {
        e.preventDefault();
        acessoForm.put(route('administracao.usuario.update-access', { user: usuario.id }), {
            onSuccess: () => setModal({ show: true, mensagem: 'Acessos atualizados com sucesso!', url: null }),
            onError: (err) => setModal({ show: true, mensagem: Object.values(err).join('\n'), url: null })
        });
    };

    const togglePackage = (id: number) => {
        setExpandedPackages(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredHistory = useMemo(() => {
        return compras.filter(compra => {
            const matchesSearch = compra.oferta.pacote.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || compra.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [compras, searchTerm, statusFilter]);

    const groupedHistory = useMemo(() => {
        const groups: Record<number, { pacote: any, tickets: Compra[] }> = {};
        
        filteredHistory.forEach(compra => {
            const pacoteId = compra.oferta.pacote.id;
            if (!groups[pacoteId]) {
                groups[pacoteId] = {
                    pacote: compra.oferta.pacote,
                    tickets: []
                };
            }
            groups[pacoteId].tickets.push(compra);
        });

        return Object.values(groups).sort((a, b) => {
            const dateA = new Date(a.tickets[0].data_compra).getTime();
            const dateB = new Date(b.tickets[0].data_compra).getTime();
            return dateB - dateA;
        });
    }, [filteredHistory]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACEITO': return <CheckCircle className="text-emerald-500" size={16} />;
            case 'RECUSADO': return <XCircle className="text-red-500" size={16} />;
            case 'CANCELADO': return <AlertCircle className="text-gray-400" size={16} />;
            default: return <Clock className="text-amber-500" size={16} />;
        }
    };

    return (
        <AdminLayout title={`Detalhes: ${usuario.nome}`}>
            <Head title={`Detalhes: ${usuario.nome}`} />

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('administracao.usuario.listar')}
                        className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inspeção de Usuário</h1>
                        <p className="text-gray-500 font-medium">Gerencie dados e visualize o histórico completo.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        usuario.role === 'ADMINISTRADOR' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        usuario.role === 'FUNCIONARIO' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                        {usuario.role}
                    </span>
                    {!usuario.is_valid && (
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-200">
                            Bloqueado
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Lateral: Info Rápida e Tabs */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors" />
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-xl mb-4">
                                {usuario.nome.charAt(0)}
                            </div>
                            <h2 className="text-xl font-black text-gray-900 text-center">{usuario.nome} {usuario.sobre_nome}</h2>
                            <p className="text-sm text-gray-500 font-medium text-center truncate w-full">{usuario.email}</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('historico')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all border ${
                                activeTab === 'historico' 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 translate-x-1' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600'
                            }`}
                        >
                            <Clock size={18} />
                            Histórico de Viagens
                        </button>
                        <button
                            onClick={() => setActiveTab('perfil')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all border ${
                                activeTab === 'perfil' 
                                    ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-100 translate-x-1' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200 hover:text-orange-600'
                            }`}
                        >
                            <UserIcon size={18} />
                            Dados do Perfil
                        </button>
                        <button
                            onClick={() => setActiveTab('acesso')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all border ${
                                activeTab === 'acesso' 
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-100 translate-x-1' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200 hover:text-purple-600'
                            }`}
                        >
                            <ShieldCheck size={18} />
                            Acessos do Usuário
                        </button>
                    </nav>
                </div>

                {/* Área de Conteúdo */}
                <div className="lg:col-span-9 space-y-6">
                    {activeTab === 'historico' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            {/* Filtros */}
                            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar por pacote..."
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder:text-gray-400 text-sm"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Filter className="text-gray-400 ml-2" size={18} />
                                    <select
                                        className="flex-1 md:w-48 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all font-black text-xs uppercase"
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                    >
                                        <option value="TODOS">Todos os Status</option>
                                        <option value="AGUARDANDO">Aguardando</option>
                                        <option value="ACEITO">Aceito</option>
                                        <option value="RECUSADO">Recusado</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            {/* Lista Agrupada */}
                            <div className="space-y-6">
                                {groupedHistory.length > 0 ? (
                                    groupedHistory.map(group => (
                                        <div key={group.pacote.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group/package">
                                            <div 
                                                className="p-6 bg-gray-50/50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => togglePackage(group.pacote.id)}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-20 h-16 rounded-2xl bg-gray-200 overflow-hidden shadow-inner flex-shrink-0">
                                                        <img 
                                                            src={group.pacote.fotos_do_pacote?.fotos[0]?.url || '/images/placeholder.jpg'} 
                                                            className="w-full h-full object-cover group-hover/package:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-gray-900 leading-tight">{group.pacote.nome}</h3>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                                                {group.tickets.length} {group.tickets.length === 1 ? 'Passagem' : 'Passagens'}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Calendar size={12} className="text-gray-300" />
                                                                Última em {formatDate(group.tickets[0].data_compra)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 group-hover/package:text-blue-600 transition-all">
                                                    {expandedPackages[group.pacote.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                            </div>

                                            {expandedPackages[group.pacote.id] && (
                                                <div className="divide-y divide-gray-50 animate-in slide-in-from-top-4">
                                                    {group.tickets.map(compra => (
                                                        <div key={compra.id} className="p-6">
                                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                                <div className="flex-1 space-y-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-red-50 rounded-lg">
                                                                            <MapPin size={16} className="text-red-500" />
                                                                        </div>
                                                                        <p className="font-bold text-gray-700">{compra.oferta.hotel.cidade.nome}</p>
                                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                                            compra.status === 'ACEITO' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                                                            compra.status === 'RECUSADO' ? 'bg-red-50 text-red-700 border-red-100' : 
                                                                            'bg-amber-50 text-amber-700 border-amber-100'
                                                                        }`}>
                                                                            {getStatusIcon(compra.status)}
                                                                            {compra.status}
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estadia</p>
                                                                            <p className="text-xs font-bold text-gray-600 mt-1">{formatDate(compra.oferta.inicio)} - {formatDate(compra.oferta.fim)}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pagamento</p>
                                                                            <p className="text-xs font-black text-emerald-600 mt-1">{formatCurrency(compra.valor_final)}</p>
                                                                        </div>
                                                                        <div className="hidden md:block">
                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Compra</p>
                                                                            <p className="text-[10px] font-mono font-medium text-gray-400 mt-1">#{compra.id.substring(0, 8)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Link 
                                                                    href={route('usuario.viagem.detalhes', { user: usuario.id, compra: compra.id })}
                                                                    className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group/btn"
                                                                >
                                                                    Voucher
                                                                    <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-3xl border border-gray-100 p-20 flex flex-col items-center text-center shadow-sm">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <SearchX className="text-gray-200" size={40} />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900">Nenhum registro encontrado</h3>
                                        <p className="text-gray-500 font-medium max-w-xs mt-2">Tente ajustar os filtros ou pesquisar por outro termo.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'perfil' && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-orange-500 pl-4 uppercase tracking-tight">Editar Dados Básicos</h3>
                            <form onSubmit={handleUpdatePerfil} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome</label>
                                        <input
                                            type="text"
                                            value={perfilForm.data.nome}
                                            onChange={e => perfilForm.setData('nome', e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sobrenome</label>
                                        <input
                                            type="text"
                                            value={perfilForm.data.sobre_nome}
                                            onChange={e => perfilForm.setData('sobre_nome', e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                                    <input
                                        type="email"
                                        value={perfilForm.data.email}
                                        onChange={e => perfilForm.setData('email', e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CPF</label>
                                    <input
                                        type="text"
                                        value={perfilForm.data.cpf}
                                        onChange={e => perfilForm.setData('cpf', e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={perfilForm.processing}
                                        className="w-full md:w-auto px-12 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all disabled:opacity-50"
                                    >
                                        {perfilForm.processing ? 'Atualizando...' : 'Salvar Perfil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'acesso' && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-purple-500 pl-4 uppercase tracking-tight">Nível de Acesso</h3>
                            <form onSubmit={handleUpdateAccess} className="space-y-10">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 ml-1">Cargo no Sistema</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {roles.map((role) => (
                                            <label
                                                key={role}
                                                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all cursor-pointer ${
                                                    acessoForm.data.role === role 
                                                        ? 'border-purple-600 bg-purple-50 text-purple-900 ring-4 ring-purple-100 shadow-lg' 
                                                        : 'border-gray-100 bg-gray-50/30 hover:border-purple-200'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full mb-4 border-2 ${
                                                    acessoForm.data.role === role ? 'bg-purple-600 border-white' : 'bg-white border-gray-300'
                                                }`} />
                                                <span className="font-black text-xs uppercase tracking-widest">{role}</span>
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role}
                                                    checked={acessoForm.data.role === role}
                                                    onChange={(e) => acessoForm.setData('role', e.target.value)}
                                                    className="hidden"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-6 ml-1">Autoridades Especiais</label>
                                    <div className="flex flex-wrap gap-3">
                                        {authorities.map((authKey) => (
                                            <button
                                                key={authKey}
                                                type="button"
                                                onClick={() => {
                                                    const current = acessoForm.data.authorities;
                                                    const updated = current.includes(authKey)
                                                        ? current.filter(a => a !== authKey)
                                                        : [...current, authKey];
                                                    acessoForm.setData('authorities', updated);
                                                }}
                                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                                                    acessoForm.data.authorities.includes(authKey)
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-100'
                                                        : 'bg-white text-gray-400 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                                                }`}
                                            >
                                                {authKey}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-start gap-4">
                                        <ShieldCheck className="text-purple-600 shrink-0" size={20} />
                                        <p className="text-xs text-purple-800 font-medium leading-relaxed">
                                            As autoridades extras concedem permissões específicas que transcendem o cargo base. Tenha cuidado ao atribuir permissões administrativas.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={acessoForm.processing}
                                        className="w-full md:w-auto px-12 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
                                    >
                                        {acessoForm.processing ? 'Sincronizando...' : 'Confirmar Acessos'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <CustomModal modalData={modal} setModal={setModal} />
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
