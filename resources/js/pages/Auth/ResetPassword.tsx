import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthLogo from '@/components/auth/AuthLogo';
import type { ModalData } from '@/components/Modal';
import Modal from '@/components/Modal';
import { schemaResetSenha } from '@/lib/schemas';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
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
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schemaResetSenha.safeParse(data);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0]) errs[issue.path[0].toString()] = issue.message;
            });
            setZodErrors(errs);
            return;
        }

        setZodErrors({});
        post(route('password.update'), {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem: 'Sua senha foi redefinida com sucesso!',
                    url: route('entrar'),
                });
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem: Object.values(err).join('\n') || 'Erro ao redefinir senha.',
                    url: null,
                });
            },
        });
    };

    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff] bg-cover bg-fixed bg-center">
            <Head title="Redefinir Senha" />
            <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 p-4 md:flex-row">
                <div className="z-10 w-full max-w-md rounded-xl bg-white/95 p-10 text-center shadow-[0_10px_25px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                    <h1 className="mb-8 text-3xl font-bold text-[#333]">
                        Nova Senha
                    </h1>

                    <form onSubmit={handleSubmit} className="text-left">
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="mb-2 block font-bold text-[#555]"
                            >
                                E-mail
                            </label>
                            <input
                                className={`w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none ${
                                    zodErrors.email || errors.email
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
                            {(zodErrors.email || errors.email) && (
                                <p className="mt-1 text-xs text-red-500 font-bold">{zodErrors.email || errors.email}</p>
                            )}
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="mb-2 block font-bold text-[#555]"
                            >
                                Senha
                            </label>
                            <input
                                className={`w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none ${
                                    zodErrors.password || errors.password
                                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                                        : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                }`}
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {(zodErrors.password || errors.password) && (
                                <p className="mt-1 text-xs text-red-500 font-bold">{zodErrors.password || errors.password}</p>
                            )}
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block font-bold text-[#555]"
                            >
                                Confirmar Senha
                            </label>
                            <input
                                className={`w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none ${
                                    zodErrors.password_confirmation || errors.password_confirmation
                                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                                        : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                }`}
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {(zodErrors.password_confirmation || errors.password_confirmation) && (
                                <p className="mt-1 text-xs text-red-500 font-bold">
                                    {zodErrors.password_confirmation || errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            className={`mt-6 w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] ${
                                processing
                                    ? 'cursor-not-allowed opacity-70'
                                    : 'cursor-pointer'
                            }`}
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Redefinindo...' : 'Redefinir Senha'}
                        </button>
                    </form>
                </div>

                <AuthLogo />
            </div>

            <Modal modalData={modal} setModal={setModal} />
        </div>
    );
}
