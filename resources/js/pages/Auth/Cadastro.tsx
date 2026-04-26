import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthLogo from '@/components/auth/AuthLogo';
import RequisitosSenha from '@/components/auth/RequisitosSenha';
import type { ModalData } from '@/components/Modal';
import CustomModal from '@/components/Modal';
import { formatarCPF, formatarTelefone, limparNaoNumericos } from '@/lib/masks';
import { schemaCadastro } from '@/lib/schemas';

export default function Cadastro() {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        nome: '',
        sobre_nome: '',
        cpf: '',
        telefone: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

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

        const result = schemaCadastro.safeParse(data);

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
        post('cadastro', {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem: 'Cadastro realizado com sucesso!',
                    url: route('entrar'),
                });
                reset();
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
        <div className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-linear-to-br from-[#fff6ea] via-[#ffffff] to-[#fff6ea] py-8">
            <Head title="Cadastre-se" />
            <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 md:flex-row">
                <div className="z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-sm">
                    <h1 className="mb-6 text-2xl font-bold text-[#333]">
                        Cadastre-se
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-left">
                            <div className="mb-4">
                                <label
                                    htmlFor="nome"
                                    className="mb-1 block text-sm font-bold text-[#555]"
                                >
                                    Nome
                                </label>
                                <input
                                    id="nome"
                                    type="text"
                                    autoComplete="given-name"
                                    className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                        zodErrors.nome || errors.nome
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    value={data.nome}
                                    onChange={(e) =>
                                        handleChange('nome', e.target.value)
                                    }
                                    required
                                />
                                {(zodErrors.nome || errors.nome) && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {zodErrors.nome || errors.nome}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="sobre_nome"
                                    className="mb-1 block text-sm font-bold text-[#555]"
                                >
                                    Sobrenome
                                </label>
                                <input
                                    id="sobre_nome"
                                    type="text"
                                    autoComplete="family-name"
                                    className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                        zodErrors.sobre_nome || errors.sobre_nome
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    value={data.sobre_nome}
                                    onChange={(e) =>
                                        handleChange('sobre_nome', e.target.value)
                                    }
                                    required
                                />
                                {(zodErrors.sobre_nome || errors.sobre_nome) && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {zodErrors.sobre_nome || errors.sobre_nome}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="cpf"
                                    className="mb-1 block text-sm font-bold text-[#555]"
                                >
                                    CPF
                                </label>
                                <input
                                    id="cpf"
                                    type="text"
                                    className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                        zodErrors.cpf || errors.cpf
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    value={formatarCPF(data.cpf)}
                                    onChange={(e) =>
                                        handleChange('cpf', e.target.value)
                                    }
                                    maxLength={14}
                                    required
                                />
                                {(zodErrors.cpf || errors.cpf) && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {zodErrors.cpf || errors.cpf}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="telefone"
                                    className="mb-1 block text-sm font-bold text-[#555]"
                                >
                                    Telefone
                                </label>
                                <input
                                    id="telefone"
                                    type="tel"
                                    autoComplete="tel"
                                    className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                        zodErrors.telefone || errors.telefone
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    value={formatarTelefone(data.telefone)}
                                    onChange={(e) =>
                                        handleChange('telefone', e.target.value)
                                    }
                                    maxLength={15}
                                    required
                                />
                                {(zodErrors.telefone || errors.telefone) && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {zodErrors.telefone || errors.telefone}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 mb-4">
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-sm font-bold text-[#555]"
                                >
                                    E-mail
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                        zodErrors.email || errors.email
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                {(zodErrors.email || errors.email) && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {zodErrors.email || errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 mb-4">
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-sm font-bold text-[#555]"
                                >
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                        zodErrors.password || errors.password
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                />
                                {(zodErrors.password || errors.password) && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {zodErrors.password || errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 mb-4">
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-1 block text-sm font-bold text-[#555]"
                                >
                                    Confirmar Senha
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                        zodErrors.password_confirmation ||
                                        errors.password_confirmation
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {(zodErrors.password_confirmation ||
                                    errors.password_confirmation) && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {zodErrors.password_confirmation ||
                                            errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>

                        <RequisitosSenha senha={data.password} />

                        <button
                            type="submit"
                            disabled={processing}
                            className={`mt-4 w-full rounded-md py-3 text-sm font-bold shadow-md transition-all duration-300 ${
                                processing
                                    ? 'cursor-not-allowed bg-gray-300'
                                    : 'cursor-pointer bg-[#ff7300] text-white hover:bg-[#cc5c00]'
                            }`}
                        >
                            {processing ? 'Processando...' : 'CADASTRAR'}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-[#666]">
                        Já possui uma conta?
                        <Link
                            href="/entrar"
                            className="ml-1 font-semibold text-[#007bff] hover:underline"
                        >
                            Faça o Login
                        </Link>
                    </p>
                    <p className="mt-6 text-sm text-[#666]">
                        Voltar para a
                        <Link
                            href="/"
                            className="ml-1 font-bold text-[#007bff] hover:underline"
                        >
                            Tela Inicial
                        </Link>
                    </p>
                </div>
                <AuthLogo />
            </div>
            <CustomModal modalData={modal} setModal={setModal} />
        </div>
    );
}
