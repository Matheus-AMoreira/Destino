import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthLogo from '@/components/auth/AuthLogo';
import type { ModalData } from '@/components/Modal';
import Modal from '@/components/Modal';

export default function Entrar() {
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
    });

    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(route('login'), {
            onError: (err) => {
                const message =
                    err.email ||
                    err.password ||
                    err.login ||
                    'Erro ao realizar login.';
                setModal({
                    show: true,
                    mensagem: message,
                    url: null,
                });
            },
        });
    };


    return (
        <div className="flex h-screen w-screen items-center justify-center bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff] bg-cover bg-fixed bg-center">
            <Head title="Conecte-se" />
            <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 p-4 md:flex-row">
                <div className="z-10 w-full max-w-md rounded-xl bg-white/95 p-10 text-center shadow-[0_10px_25px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                    <h1 className="mb-8 text-3xl font-bold text-[#333]">
                        Conecte-se
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mb-5 text-left"
                    >
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

                        <div className="mt-1 mb-4 flex justify-end">
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-[#007bff] hover:underline"
                            >
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        <button
                            className={`w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] ${
                                processing
                                    ? 'cursor-not-allowed opacity-70'
                                    : 'cursor-pointer'
                            }`}
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? (
                                <span aria-live="polite">Entrando...</span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-[#666]">
                        Não possui uma conta?
                        <Link
                            href={route('cadastro')}
                            className="ml-1 font-bold text-[#007bff] no-underline hover:underline"
                        >
                            Cadastre-se
                        </Link>
                    </p>

                    <p className="mt-6 text-sm text-[#666]">
                        Voltar para a
                        <Link
                            href={route('home')}
                            className="ml-1 font-bold text-[#007bff] no-underline hover:underline"
                        >
                            Tela Inicial
                        </Link>
                    </p>
                </div>

                <AuthLogo />
            </div>

            <Modal modalData={modal} setModal={setModal} />
        </div>
    );
}
