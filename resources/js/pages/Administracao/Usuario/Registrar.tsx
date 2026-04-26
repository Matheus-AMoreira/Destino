import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft,
    ShieldCheck,
    UserPlus,
    Mail,
    CreditCard,
    User as UserIcon,
    Phone,
    Plus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ModalData } from '@/components/Modal';
import CustomModal from '@/components/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import type { Role } from '@/types/auth';
import { useRoute } from 'ziggy-js';
import { formatarCPF, formatarTelefone, limparNaoNumericos } from '@/lib/masks';
import { schemaRegistrarStaff } from '@/lib/schemas';

interface Props {
    roles: Role[];
}

export default function Registrar({ roles }: Props) {
    const route = useRoute();
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const { data, setData, post, processing, errors, transform } = useForm({
        nome: '',
        sobre_nome: '',
        email: '',
        cpf: '',
        telefone: '',
        role_id: roles[0]?.id || '',
    });

    useEffect(() => {
        transform((data) => ({
            ...data,
            cpf: limparNaoNumericos(data.cpf),
            telefone: limparNaoNumericos(data.telefone)
        }));
    }, [data.cpf, data.telefone]);

    const handleChange = (campo: string, valor: string) => {
        const rawValue = limparNaoNumericos(valor);
        if (campo === 'cpf') {
            setData('cpf', rawValue.substring(0, 11));
        } else if (campo === 'telefone') {
            setData('telefone', rawValue.substring(0, 11));
        } else {
            setData(campo as any, valor);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schemaRegistrarStaff.safeParse(data);

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
        post(route('administracao.usuario.store'), {
            onSuccess: () => {
                setModal({ 
                    show: true, 
                    mensagem: 'Funcionário cadastrado com sucesso! O convite foi enviado ao e-mail informado.', 
                    url: route('administracao.usuario.listar') 
                });
            },
            onError: (err) => {
                setModal({ 
                    show: true, 
                    mensagem: 'Erro ao cadastrar funcionário. ' + Object.values(err).join(', '), 
                    url: null 
                });
            }
        });
    };

    return (
        <AdminLayout title="Novo Funcionário">
            <Head title="Novo Funcionário" />

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link 
                        href={route('administracao.usuario.listar')}
                        className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Novo Funcionário</h1>
                </div>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <UserIcon size={18} className="text-blue-600" />
                                Informações Pessoais
                            </h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Nome</label>
                                    <input
                                        type="text"
                                        value={data.nome}
                                        onChange={e => handleChange('nome', e.target.value)}
                                        className={`w-full px-4 py-2 bg-white border ${zodErrors.nome || errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm`}
                                        placeholder="Nome do colaborador"
                                    />
                                    {(zodErrors.nome || errors.nome) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.nome || errors.nome}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Sobrenome</label>
                                    <input
                                        type="text"
                                        value={data.sobre_nome}
                                        onChange={e => handleChange('sobre_nome', e.target.value)}
                                        className={`w-full px-4 py-2 bg-white border ${zodErrors.sobre_nome || errors.sobre_nome ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm`}
                                        placeholder="Sobrenome"
                                    />
                                    {(zodErrors.sobre_nome || errors.sobre_nome) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.sobre_nome || errors.sobre_nome}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">E-mail</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 bg-white border ${zodErrors.email || errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm`}
                                            placeholder="email@destino.com"
                                        />
                                    </div>
                                    {(zodErrors.email || errors.email) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.email || errors.email}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">CPF</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            value={formatarCPF(data.cpf)}
                                            onChange={e => handleChange('cpf', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 bg-white border ${zodErrors.cpf || errors.cpf ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm`}
                                            placeholder="000.000.000-00"
                                        />
                                    </div>
                                    {(zodErrors.cpf || errors.cpf) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.cpf || errors.cpf}</p>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Telefone (Opcional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={formatarTelefone(data.telefone)}
                                        onChange={e => handleChange('telefone', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2 bg-white border ${zodErrors.telefone || errors.telefone ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm`}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                {(zodErrors.telefone || errors.telefone) && <p className="text-red-500 text-[10px] font-bold">{zodErrors.telefone || errors.telefone}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck size={18} className="text-blue-600" />
                                Cargo e Função
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <label
                                        key={role.id}
                                        className={`flex flex-col p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                            Number(data.role_id) === role.id 
                                                ? 'border-blue-600 bg-blue-50' 
                                                : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`font-bold text-sm ${Number(data.role_id) === role.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {role.name}
                                            </span>
                                            <input
                                                type="radio"
                                                name="role_id"
                                                value={role.id}
                                                checked={Number(data.role_id) === role.id}
                                                onChange={(e) => setData('role_id', e.target.value)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {role.description || 'Acesso às ferramentas de administração.'}
                                        </p>
                                    </label>
                                ))}
                            </div>
                            {(zodErrors.role_id || errors.role_id) && <p className="text-red-500 text-[10px] font-bold mt-2">{zodErrors.role_id || errors.role_id}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={route('administracao.usuario.listar')}
                            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Plus size={20} />
                            {processing ? 'Enviando...' : 'Cadastrar e Enviar Convite'}
                        </button>
                    </div>
                </form>
            </div>

            <CustomModal modalData={modal} setModal={setModal} />
        </AdminLayout>
    );
}
