import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthLogo from '@/components/auth/AuthLogo';
import type { ModalData } from '@/components/Modal';
import Modal from '@/components/Modal';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(route('password.email'), {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem: 'Um link de recuperação foi enviado para o seu e-mail.',
                    url: null,
                });
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem: err.email || 'Erro ao enviar e-mail de recuperação.',
                    url: null,
                });
            },
        });
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff] bg-cover bg-fixed bg-center">
            <Head title="Esqueci minha senha" />
            <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 p-4 md:flex-row">
                <div className="z-10 w-full max-w-md rounded-xl bg-white/95 p-10 text-center shadow-[0_10px_25px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                    <h1 className="mb-6 text-3xl font-bold text-[#333]">
                        Recuperar Senha
                    </h1>

                    <p className="mb-8 text-sm text-gray-600">
                        Esqueceu sua senha? Sem problemas. Basta nos informar seu endereço de e-mail e enviaremos um link de redefinição de senha.
                    </p>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="text-left">
                        <label
                            htmlFor="email"
                            className="mb-2 block font-bold text-[#555]"
                        >
                            E-mail
                        </label>
                        <input
                            className={`w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none ${
                                errors.email
                                    ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                                    : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                            }`}
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}

                        <button
                            className={`mt-6 w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] ${
                                processing
                                    ? 'cursor-not-allowed opacity-70'
                                    : 'cursor-pointer'
                            }`}
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Enviando...' : 'Enviar Link'}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col gap-4">
                        <Link
                            href={route('entrar')}
                            className="text-sm font-bold text-gray-500 hover:text-gray-700 hover:underline"
                        >
                            Voltar para o Login
                        </Link>
                    </div>
                </div>

                <AuthLogo />
            </div>

            <Modal modalData={modal} setModal={setModal} />
        </div>
    );
}
