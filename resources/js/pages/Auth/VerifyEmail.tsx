import { Head, Link } from '@inertiajs/react';
import AuthLogo from '@/components/auth/AuthLogo';
import Image from '@/components/Image';
import { useVerifyEmail } from '@/services/auth/authService';
import { logout as routeLogout } from '@/routes';

export default function VerifyEmail({ status }: { status?: string }) {
    const { processing, handleSubmit } = useVerifyEmail();

    const linkSent = status === 'verification-link-sent';

    return (
        <div className="flex min-h-screen w-full bg-white">
            <Head title="Verificar E-mail" />

            <div className="grid w-full grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Lado Esquerdo: Conteúdo */}
                <div className="flex items-center justify-center bg-linear-to-br from-[#fff6ea] via-[#ffffff] to-[#fff6ea] p-8">
                    <div className="z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                        {/* Ícone de envelope */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3e0]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-[#ff7300]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0L12 13.5 2.25 6.75"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h1 className="mb-2 text-center text-2xl font-bold text-[#333]">
                            Verifique seu e-mail
                        </h1>
                        <p className="mb-6 text-center text-sm text-gray-500">
                            Obrigado por se cadastrar! Enviamos um link de
                            confirmação para o seu e-mail. Clique nele para
                            ativar sua conta.
                        </p>

                        {/* Feedback de reenvio */}
                        {linkSent && (
                            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                ✓ Um novo link de verificação foi enviado para o
                                seu e-mail.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full rounded-md py-3 text-sm font-bold shadow-md transition-all duration-300 ${
                                    processing
                                        ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                        : 'cursor-pointer bg-[#ff7300] text-white hover:bg-[#cc5c00]'
                                }`}
                            >
                                {processing
                                    ? 'Enviando...'
                                    : 'Reenviar E-mail de Verificação'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-[#666]">
                            <Link
                                href={routeLogout().url}
                                method="post"
                                as="button"
                                className="font-semibold text-[#007bff] hover:underline"
                            >
                                Sair da conta
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Imagem + Logo (igual ao Cadastro) */}
                <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
                    <Image
                        name={'destaque'}
                        alt={'Imagem de destaque'}
                        style="absolute inset-0 z-0 h-full w-full object-cover object-center"
                    />
                    <div className="z-10 flex h-full w-full items-center justify-center bg-black/20 backdrop-brightness-75">
                        <AuthLogo />
                    </div>
                </div>
            </div>
        </div>
    );
}
