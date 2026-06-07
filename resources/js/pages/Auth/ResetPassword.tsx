import { Head } from '@inertiajs/react';
import AuthLogo from '@/components/auth/AuthLogo';
import Image from '@/components/Image';
import type { ModalData } from '@/components/Modal';
import Modal from '@/components/Modal';
import { useResetPassword } from '@/services/auth/authService';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { form, modal, setModal, zodErrors, handleSubmit } = useResetPassword(
        token,
        email,
    );

    const { data, setData, processing, errors } = form;

    return (
        <div className="flex min-h-screen w-full bg-white">
            <Head title="Redefinir Senha" />

            <div className="grid w-full grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Lado Esquerdo: Formulário */}
                <div className="flex items-center justify-center bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff] p-8">
                    <div className="z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white/95 p-10 text-center shadow-2xl backdrop-blur-sm">
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
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                {(zodErrors.email || errors.email) && (
                                    <p className="mt-1 text-xs text-red-500 font-bold">
                                        {zodErrors.email || errors.email}
                                    </p>
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
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                />
                                {(zodErrors.password || errors.password) && (
                                    <p className="mt-1 text-xs text-red-500 font-bold">
                                        {zodErrors.password || errors.password}
                                    </p>
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
                                        zodErrors.password_confirmation ||
                                        errors.password_confirmation
                                            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                                            : 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]'
                                    }`}
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
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
                                    <p className="mt-1 text-xs text-red-500 font-bold">
                                        {zodErrors.password_confirmation ||
                                            errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <button
                                className={`mt-6 w-full rounded-lg bg-[#2071b3] py-3 text-lg font-bold text-white transition duration-300 hover:bg-[#1a5b8e] active:scale-[0.98] ${
                                    processing
                                        ? 'cursor-not-allowed opacity-70'
                                        : 'cursor-pointer shadow-md'
                                }`}
                                type="submit"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Redefinindo...'
                                    : 'Redefinir Senha'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lado Direito: Imagem com Logo centralizada */}
                <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
                    <Image
                        name={'destaque'} // Certifique-se que o componente Image aceita este nome ou altere para o caminho correto
                        alt={'Imagem de redefinição de senha'}
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
