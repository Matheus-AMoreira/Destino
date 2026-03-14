import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout title="Email Verification">
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
                    <div className="mb-4 text-sm text-gray-600">
                        Obrigado por se cadastrar! Antes de começar, você poderia verificar seu endereço de e-mail clicando no link que acabamos de enviar para você? Se você não recebeu o e-mail, teremos o prazer de lhe enviar outro.
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            Um novo link de verificação foi enviado para o endereço de e-mail fornecido durante o registro.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mt-4 flex items-center justify-between">
                            <button
                                className={`rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 ${
                                    processing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={processing}
                            >
                                Reenviar E-mail de Verificação
                            </button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Sair
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
