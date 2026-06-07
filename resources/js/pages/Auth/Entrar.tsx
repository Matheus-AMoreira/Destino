import { Head, Link } from '@inertiajs/react';
import AuthLogo from '@/components/auth/AuthLogo';
import Image from '@/components/Image';
import type { ModalData } from '@/components/Modal';
import Modal from '@/components/Modal';
import { useLogin } from '@/services/auth/authService';
import { cadastro as routeCadastro, home as routeHome } from '@/routes';
import { request as routePasswordRequest } from '@/routes/password';

export default function Entrar() {
    const { form, modal, setModal, handleSubmit } = useLogin();

    const { data, setData, processing } = form;

    return (
        <div className="flex min-h-screen w-full bg-white">
            <Head title="Conecte-se" />

            <div className="grid w-full grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Lado Esquerdo: Formulário */}
                <div className="flex items-center justify-center bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff] p-8">
                    <div className="z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white/95 p-10 text-center shadow-2xl backdrop-blur-sm">
                        <h1 className="mb-8 text-3xl font-bold text-[#333]">
                            Conecte-se
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="mb-5 text-left"
                        >
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="mb-2 block font-bold text-[#555]"
                                >
                                    E-mail
                                </label>
                                <input
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition duration-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)] focus:outline-none"
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div className="mb-2">
                                <label
                                    htmlFor="password"
                                    className="mb-2 block font-bold text-[#555]"
                                >
                                    Senha
                                </label>
                                <input
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition duration-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)] focus:outline-none"
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-6 flex justify-end">
                                <Link
                                    href={routePasswordRequest().url}
                                    className="text-xs font-bold text-[#007bff] hover:underline"
                                >
                                    Esqueceu sua senha?
                                </Link>
                            </div>

                            <button
                                className={`w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] ${
                                    processing
                                        ? 'cursor-not-allowed opacity-70'
                                        : 'cursor-pointer shadow-md'
                                }`}
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        <div className="space-y-3">
                            <p className="text-sm text-[#666]">
                                Não possui uma conta?
                                <Link
                                    href={routeCadastro().url}
                                    className="ml-1 font-bold text-[#007bff] hover:underline"
                                >
                                    Cadastre-se
                                </Link>
                            </p>

                            <p className="text-sm text-[#666]">
                                Voltar para a
                                <Link
                                    href={routeHome().url}
                                    className="ml-1 font-bold text-[#007bff] hover:underline"
                                >
                                    Tela Inicial
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Imagem com Logo centralizada */}
                <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
                    <Image
                        name={'destaque'} // Certifique-se que o componente Image aceita este nome ou altere para o caminho correto
                        alt={'Imagem de login'}
                        style="absolute inset-0 z-0 h-full w-full object-cover object-center"
                    />

                    {/* Overlay para escurecer levemente a imagem e destacar a logo */}
                    <div className="z-10 flex h-full w-full items-center justify-center bg-black/25 backdrop-brightness-75">
                        <AuthLogo />
                    </div>
                </div>
            </div>

            <Modal modalData={modal} setModal={setModal} />
        </div>
    );
}
