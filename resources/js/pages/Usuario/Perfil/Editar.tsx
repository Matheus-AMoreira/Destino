import {
    AlertCircle,
    CreditCard,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone as PhoneIcon,
    Save,
    ShieldCheck,
    User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import RequisitosSenha from '@/components/auth/RequisitosSenha';
import CustomModal from '@/components/Modal';
import GuestLayout from '@/layouts/GuestLayout';
import { usePerfil, useSenha } from '@/services/identidade/perfilService';

interface Props {
    user: any;
}

export default function Editar({ user }: Props) {
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

    const perfil = usePerfil(user);
    const senha = useSenha();

    if (!user) return null;

    return (
        <GuestLayout title="Meu Perfil">
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Configurações de Perfil
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Gerencie suas informações pessoais e segurança da conta.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-72 bg-gray-50 p-8 border-r border-gray-100">
                        <div className="space-y-3">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                    activeTab === 'info'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-500 hover:bg-white hover:text-blue-600'
                                }`}
                            >
                                <UserIcon size={20} />
                                <span>Informações Pessoais</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                    activeTab === 'password'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-500 hover:bg-white hover:text-blue-600'
                                }`}
                            >
                                <Lock size={20} />
                                <span>Senha e Segurança</span>
                            </button>
                        </div>

                        <div className="mt-auto pt-10 px-4">
                            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                                <ShieldCheck
                                    className="text-blue-600 mb-2"
                                    size={24}
                                />
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                    Status da Conta
                                </p>
                                <p className="text-sm font-bold text-blue-900 mt-1">
                                    Conta Verificada
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 lg:p-12">
                        {activeTab === 'info' ? (
                            <form
                                onSubmit={perfil.submit}
                                className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nome */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                            Nome
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <UserIcon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={perfil.form.data.nome}
                                                onChange={(e) =>
                                                    perfil.handleChange(
                                                        'nome',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="Seu nome"
                                            />
                                        </div>
                                        {(perfil.zodErrors.nome ||
                                            perfil.form.errors.nome) && (
                                            <p className="text-red-500 text-xs font-bold ml-4">
                                                {perfil.zodErrors.nome ||
                                                    perfil.form.errors.nome}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sobrenome */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                            Sobrenome
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <UserIcon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={
                                                    perfil.form.data.sobre_nome
                                                }
                                                onChange={(e) =>
                                                    perfil.handleChange(
                                                        'sobre_nome',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="Seu sobrenome"
                                            />
                                        </div>
                                        {(perfil.zodErrors.sobre_nome ||
                                            perfil.form.errors.sobre_nome) && (
                                            <p className="text-red-500 text-xs font-bold ml-4">
                                                {perfil.zodErrors.sobre_nome ||
                                                    perfil.form.errors
                                                        .sobre_nome}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* E-mail */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                        E-mail de Contato
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={perfil.form.data.email}
                                            onChange={(e) =>
                                                perfil.form.setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                    {(perfil.zodErrors.email ||
                                        perfil.form.errors.email) && (
                                        <p className="text-red-500 text-xs font-bold ml-4">
                                            {perfil.zodErrors.email ||
                                                perfil.form.errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* CPF */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                            CPF
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <CreditCard size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={perfil.cpfFormatado}
                                                className="w-full pl-12 pr-14 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    perfil.setShowFullCpf(
                                                        !perfil.showFullCpf,
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title={
                                                    perfil.showFullCpf
                                                        ? 'Esconder'
                                                        : 'Mostrar'
                                                }
                                            >
                                                {perfil.showFullCpf ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Telefone */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                            Telefone
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <PhoneIcon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={perfil.telefoneFormatado}
                                                onChange={(e) =>
                                                    perfil.handleChange(
                                                        'telefone',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>
                                        {(perfil.zodErrors.telefone ||
                                            perfil.form.errors.telefone) && (
                                            <p className="text-red-500 text-xs font-bold ml-4">
                                                {perfil.zodErrors.telefone ||
                                                    perfil.form.errors.telefone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={perfil.form.processing}
                                    className="flex items-center justify-center rounded-lg bg-[#2071b3] w-113 px-10 py-4 text-lg font-bold text-white shadow-2xl transition duration-300 hover:scale-105 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {perfil.form.processing ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save size={18} />
                                            <span>Salvar Alterações</span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form
                                onSubmit={senha.submit}
                                className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
                            >
                                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4 mb-8">
                                    <AlertCircle
                                        className="text-amber-500 flex-shrink-0"
                                        size={24}
                                    />
                                    <div>
                                        <p className="text-amber-900 font-bold text-sm">
                                            Mudança de Senha
                                        </p>
                                        <p className="text-amber-700 text-xs mt-1 font-medium leading-relaxed">
                                            Sua nova senha deve seguir os
                                            requisitos de segurança da
                                            plataforma. Você precisará confirmar
                                            sua senha atual para realizar esta
                                            alteração.
                                        </p>
                                    </div>
                                </div>

                                {/* Senha Atual */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                        Senha Atual
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={
                                                senha.form.data.current_password
                                            }
                                            onChange={(e) =>
                                                senha.form.setData(
                                                    'current_password',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {(senha.zodErrors.current_password ||
                                        senha.form.errors.current_password) && (
                                        <p className="text-red-500 text-xs font-bold ml-4">
                                            {senha.zodErrors.current_password ||
                                                senha.form.errors
                                                    .current_password}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nova Senha */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                            Nova Senha
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={senha.form.data.password}
                                                onChange={(e) =>
                                                    senha.form.setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {(senha.zodErrors.password ||
                                            senha.form.errors.password) && (
                                            <p className="text-red-500 text-xs font-bold ml-4">
                                                {senha.zodErrors.password ||
                                                    senha.form.errors.password}
                                            </p>
                                        )}
                                        <RequisitosSenha
                                            senha={senha.form.data.password}
                                        />
                                    </div>

                                    {/* Confirmar Senha */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                            Confirmar Nova Senha
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={
                                                    senha.form.data
                                                        .password_confirmation
                                                }
                                                onChange={(e) =>
                                                    senha.form.setData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {senha.zodErrors
                                            .password_confirmation && (
                                            <p className="text-red-500 text-xs font-bold ml-4">
                                                {
                                                    senha.zodErrors
                                                        .password_confirmation
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={senha.form.processing}
                                    className="flex items-center justify-center rounded-lg bg-[#2071b3] w-113 px-10 py-4 text-lg font-bold text-white shadow-2xl transition duration-300 hover:scale-105 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {senha.form.processing ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Lock size={18} />
                                            <span>Atualizar Senha</span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <CustomModal modalData={perfil.modal} setModal={perfil.setModal} />
            <CustomModal modalData={senha.modal} setModal={senha.setModal} />
        </GuestLayout>
    );
}
