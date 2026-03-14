import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthLogo from '@/components/auth/AuthLogo';
import CampoInput from '@/components/auth/CampoInput';
import Modal from '@/components/Modal';
import type { ModalData } from '@/components/Modal';

export default function Entrar() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem: err.login || 'Erro ao realizar login.',
                    url: route('home'),
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

                    <form onSubmit={handleSubmit}>
                        <CampoInput
                            label="E-mail"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            maxLength={100}
                        />
                        <CampoInput
                            label="Senha"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                            maxLength={100}
                        />

                        <button
                            className={`mt-3 w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] ${
                                processing
                                    ? 'cursor-not-allowed opacity-70'
                                    : 'cursor-pointer'
                            }`}
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-[#666]">
                        Não possui uma conta?
                        <Link
                            href="/cadastro"
                            className="ml-1 font-bold text-[#007bff] no-underline hover:underline"
                        >
                            Cadastre-se
                        </Link>
                    </p>

                    <p className="mt-6 text-sm text-[#666]">
                        Voltar para a
                        <Link
                            href="/"
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
