import GuestLayout from '@/layouts/GuestLayout';
import { useForm, usePage } from '@inertiajs/react';
import { 
    User as UserIcon, 
    Mail, 
    CreditCard, 
    Lock, 
    Save, 
    ShieldCheck, 
    AlertCircle,
    Phone as PhoneIcon
} from 'lucide-react';
import React, { FormEventHandler, useState, useEffect } from 'react';
import RequisitosSenha from '@/components/auth/RequisitosSenha';
import CustomModal, { ModalData } from '@/components/Modal';
import { formatarCPF, formatarTelefone, limparNaoNumericos } from '@/lib/masks';
import { schemaPerfil, schemaSenha } from '@/lib/schemas';

interface Props {
    user: any;
}

export default function Editar({ user }: Props) {
    const { success, error }: any = usePage().props;
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const profileForm = useForm({
        nome: user.nome,
        sobre_nome: user.sobre_nome,
        email: user.email,
        cpf: user.cpf || '',
        telefone: user.telefone || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        profileForm.transform((data) => ({
            ...data,
            cpf: limparNaoNumericos(data.cpf),
            telefone: limparNaoNumericos(data.telefone)
        }));
    }, [profileForm.data.cpf, profileForm.data.telefone]);

    const handleProfileChange = (campo: string, valor: string) => {
        const rawValue = limparNaoNumericos(valor);
        if (campo === 'cpf') {
            profileForm.setData('cpf', rawValue.substring(0, 11));
        } else if (campo === 'telefone') {
            profileForm.setData('telefone', rawValue.substring(0, 11));
        } else {
            profileForm.setData(campo as any, valor);
        }
    };

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        
        const result = schemaPerfil.safeParse(profileForm.data);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0]) errs[issue.path[0].toString()] = issue.message;
            });
            setZodErrors(errs);
            return;
        }

        setZodErrors({});
        profileForm.put(route('usuario.perfil.update', { user_slug: user.name_slug }), {
            preserveScroll: true,
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem: 'Perfil atualizado com sucesso!',
                    url: null,
                });
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem: Object.values(err).join('\n'),
                    url: null,
                });
            },
        });
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();

        const result = schemaSenha.safeParse(passwordForm.data);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0]) errs[issue.path[0].toString()] = issue.message;
            });
            setZodErrors(errs);
            return;
        }

        setZodErrors({});
        passwordForm.put(route('usuario.perfil.password', { user_slug: user.name_slug }), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setModal({
                    show: true,
                    mensagem: 'Senha alterada com sucesso!',
                    url: null,
                });
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem: Object.values(err).join('\n'),
                    url: null,
                });
            },
        });
    };

    return (
        <GuestLayout title="Meu Perfil">
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configurações de Perfil</h1>
                    <p className="text-gray-500 mt-2 font-medium">Gerencie suas informações pessoais e segurança da conta.</p>
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
                                <ShieldCheck className="text-blue-600 mb-2" size={24} />
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Status da Conta</p>
                                <p className="text-sm font-bold text-blue-900 mt-1">Conta Verificada</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 lg:p-12">
                        {activeTab === 'info' ? (
                            <form onSubmit={submitProfile} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nome</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <UserIcon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileForm.data.nome}
                                                onChange={e => handleProfileChange('nome', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="Seu nome"
                                            />
                                        </div>
                                        {(zodErrors.nome || profileForm.errors.nome) && <p className="text-red-500 text-xs font-bold ml-4">{zodErrors.nome || profileForm.errors.nome}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Sobrenome</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <UserIcon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileForm.data.sobre_nome}
                                                onChange={e => handleProfileChange('sobre_nome', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="Seu sobrenome"
                                            />
                                        </div>
                                        {(zodErrors.sobre_nome || profileForm.errors.sobre_nome) && <p className="text-red-500 text-xs font-bold ml-4">{zodErrors.sobre_nome || profileForm.errors.sobre_nome}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">E-mail de Contato</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={e => profileForm.setData('email', e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                    {(zodErrors.email || profileForm.errors.email) && <p className="text-red-500 text-xs font-bold ml-4">{zodErrors.email || profileForm.errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">CPF</label>
                                        <div className="relative group opacity-75">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <CreditCard size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={formatarCPF(profileForm.data.cpf)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-100 border-2 border-transparent rounded-2xl font-bold text-gray-500 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Telefone</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <PhoneIcon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={formatarTelefone(profileForm.data.telefone)}
                                                onChange={e => handleProfileChange('telefone', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>
                                        {(zodErrors.telefone || profileForm.errors.telefone) && <p className="text-red-500 text-xs font-bold ml-4">{zodErrors.telefone || profileForm.errors.telefone}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-95"
                                >
                                    {profileForm.processing ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>Salvar Alterações</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={submitPassword} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4 mb-8">
                                    <AlertCircle className="text-amber-500 flex-shrink-0" size={24} />
                                    <div>
                                        <p className="text-amber-900 font-bold text-sm">Mudança de Senha</p>
                                        <p className="text-amber-700 text-xs mt-1 font-medium leading-relaxed">
                                            Sua nova senha deve seguir os requisitos de segurança da plataforma. Você precisará confirmar sua senha atual para realizar esta alteração.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Senha Atual</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {(zodErrors.current_password || passwordForm.errors.current_password) && <p className="text-red-500 text-xs font-bold ml-4">{zodErrors.current_password || passwordForm.errors.current_password}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nova Senha</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={e => passwordForm.setData('password', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {(zodErrors.password || passwordForm.errors.password) && <p className="text-red-500 text-xs font-bold ml-4">{zodErrors.password || passwordForm.errors.password}</p>}
                                        <RequisitosSenha senha={passwordForm.data.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirmar Nova Senha</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-900"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {zodErrors.password_confirmation && <p className="text-red-500 text-xs font-bold ml-4">{zodErrors.password_confirmation}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-95"
                                >
                                    {passwordForm.processing ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Lock size={18} />
                                            <span>Atualizar Senha</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <CustomModal modalData={modal} setModal={setModal} />
        </GuestLayout>
    );
}
