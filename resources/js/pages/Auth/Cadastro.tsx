import { Head, Link } from '@inertiajs/react';
import AuthLogo from '@/components/auth/AuthLogo';
import RequisitosSenha from '@/components/auth/RequisitosSenha';
import Image from '@/components/Image';
import type { ModalData } from '@/components/Modal';
import CustomModal from '@/components/Modal';
import { formatarCPF, formatarTelefone, limparNaoNumericos } from '@/lib/masks';
import { useCadastro } from '@/services/auth/authService';
import { entrar as routeEntrar, home as routeHome } from '@/routes';

export default function Cadastro() {
    const { form, modal, setModal, zodErrors, handleSubmit } = useCadastro();

    const { data, setData, processing, errors } = form;

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

    return (
        <div className="flex min-h-screen w-full bg-white">
            <Head title="Cadastre-se" />

            <div className="grid w-full grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Lado Esquerdo: Formulário */}
                <div className="flex items-center justify-center bg-linear-to-br from-[#fff6ea] via-[#ffffff] to-[#fff6ea] p-8">
                    <div className="z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                        <h1 className="mb-6 text-2xl font-bold text-[#333] text-center">
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
                                        className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                            zodErrors.nome || errors.nome
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-[#007bff]'
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
                                        className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                            zodErrors.sobre_nome ||
                                            errors.sobre_nome
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-[#007bff]'
                                        }`}
                                        value={data.sobre_nome}
                                        onChange={(e) =>
                                            handleChange(
                                                'sobre_nome',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {(zodErrors.sobre_nome ||
                                        errors.sobre_nome) && (
                                        <p className="mt-1 text-[10px] text-red-500 font-bold">
                                            {zodErrors.sobre_nome ||
                                                errors.sobre_nome}
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
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-[#007bff]'
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
                                        className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                            zodErrors.telefone ||
                                            errors.telefone
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-[#007bff]'
                                        }`}
                                        value={formatarTelefone(data.telefone)}
                                        onChange={(e) =>
                                            handleChange(
                                                'telefone',
                                                e.target.value,
                                            )
                                        }
                                        maxLength={15}
                                        required
                                    />
                                    {(zodErrors.telefone ||
                                        errors.telefone) && (
                                        <p className="mt-1 text-[10px] text-red-500 font-bold">
                                            {zodErrors.telefone ||
                                                errors.telefone}
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
                                        className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                            zodErrors.email || errors.email
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-[#007bff]'
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
                                        title="Senha"
                                        className="mb-1 block text-sm font-bold text-[#555]"
                                    >
                                        Senha
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                            zodErrors.password ||
                                            errors.password
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-[#007bff]'
                                        }`}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        required
                                    />
                                    {(zodErrors.password ||
                                        errors.password) && (
                                        <p className="mt-1 text-[10px] text-red-500 font-bold">
                                            {zodErrors.password ||
                                                errors.password}
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
                                        className={`w-full rounded-md border px-3 py-2 text-sm transition duration-300 focus:outline-none ${
                                            zodErrors.password_confirmation ||
                                            errors.password_confirmation
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-[#007bff]'
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

                        <div className="mt-6 text-center text-sm text-[#666]">
                            <p>
                                Já possui uma conta?{' '}
                                <Link
                                    href={routeEntrar().url}
                                    className="font-semibold text-[#007bff] hover:underline"
                                >
                                    Faça o Login
                                </Link>
                            </p>
                            <p className="mt-2">
                                Voltar para a{' '}
                                <Link
                                    href={routeHome().url}
                                    className="font-bold text-[#007bff] hover:underline"
                                >
                                    Tela Inicial
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Fundo com Logo centralizada */}
                <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
                    {/* A imagem é posicionada de forma absoluta para preencher todo o container (inset-0) */}
                    <Image
                        name={'destaque'}
                        alt={'Imagem de destaque'}
                        // Usamos style para passar as classes Tailwind que garantem o preenchimento total e z-0
                        style="absolute inset-0 z-0 h-full w-full object-cover object-center"
                    />

                    {/* Esta div contém a logo e fica por cima (z-10), centralizando-a */}
                    <div className="z-10 flex h-full w-full items-center justify-center bg-black/20 backdrop-brightness-75">
                        <AuthLogo />
                    </div>
                </div>
            </div>

            <CustomModal modalData={modal} setModal={setModal} />
        </div>
    );
}
