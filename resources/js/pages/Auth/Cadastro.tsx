import AuthLogo from '@/components/auth/AuthLogo';
import CampoInput from '@/components/auth/CampoInput';
import CustomModal, { ModalData } from '@/components/CustomModal';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

// Utility functions for formatting (Simplified placeholders)
const formatarCPF = (val: string) => val.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
const formatarTelefone = (val: string) => val.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").substring(0, 15);

const schemaCadastro = z
    .object({
        nome: z.string().min(3, "Mínimo 3 caracteres").regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, "Apenas letras"),
        sobre_nome: z.string().min(3, "Mínimo 3 caracteres").regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, "Apenas letras"),
        cpf: z.string().refine((val) => val.replace(/\D/g, '').length === 11, "CPF inválido"),
        telefone: z.string().refine((val) => val.replace(/\D/g, '').length >= 10, "Telefone inválido"),
        email: z.string().email("E-mail inválido"),
        password: z.string().min(8, "Mínimo 8 caracteres").regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/).regex(/[@$!%*?&#\-_]/),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "As senhas não coincidem",
        path: ["password_confirmation"],
    });

export default function Cadastro() {
    const { data, setData, post, processing, errors, reset } = useForm({
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

    const handleChange = (campo: string, valor: string) => {
        let v = valor;
        if (campo === 'cpf') v = formatarCPF(valor);
        if (campo === 'telefone') v = formatarTelefone(valor);
        setData(campo as any, v);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const result = schemaCadastro.safeParse(data);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.errors.forEach(e => {
                if (e.path[0]) errs[e.path[0].toString()] = e.message;
            });
            setZodErrors(errs);
            return;
        }

        setZodErrors({});
        post('/register', {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem: 'Cadastro realizado com sucesso!',
                    url: '/entrar',
                });
                reset();
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem: Object.values(err).join('\n'),
                    url: null,
                });
            }
        });
    };

    const requisitosSenha = [
        { label: "Mínimo de 8 caracteres", valido: data.password.length >= 8 },
        { label: "Uma letra maiúscula", valido: /[A-Z]/.test(data.password) },
        { label: "Uma letra minúscula", valido: /[a-z]/.test(data.password) },
        { label: "Um número", valido: /\d/.test(data.password) },
        { label: "Um caractere especial", valido: /[@$!%*?&#\-_]/.test(data.password) },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-[#fff6ea] via-[#ffffff] to-[#fff6ea] py-8 overflow-y-auto">
            <Head title="Cadastre-se" />
            <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 md:flex-row">
                <div className="z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-sm">
                    <h1 className="mb-6 text-2xl font-bold text-[#333]">Cadastre-se</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-left">
                            <CampoInput
                                label="Nome"
                                type="text"
                                value={data.nome}
                                onChange={(e) => handleChange('nome', e.target.value)}
                                isError={!!zodErrors.nome || !!errors.nome}
                            />
                            <CampoInput
                                label="Sobrenome"
                                type="text"
                                value={data.sobre_nome}
                                onChange={(e) => handleChange('sobre_nome', e.target.value)}
                                isError={!!zodErrors.sobre_nome || !!errors.sobre_nome}
                            />
                            <CampoInput
                                label="CPF"
                                type="text"
                                value={data.cpf}
                                onChange={(e) => handleChange('cpf', e.target.value)}
                                isError={!!zodErrors.cpf || !!errors.cpf}
                            />
                            <CampoInput
                                label="Telefone"
                                type="tel"
                                value={data.telefone}
                                onChange={(e) => handleChange('telefone', e.target.value)}
                                isError={!!zodErrors.telefone || !!errors.telefone}
                            />
                            <div className="col-span-2">
                                <CampoInput
                                    label="E-mail"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    isError={!!zodErrors.email || !!errors.email}
                                />
                            </div>
                            <div className="col-span-2">
                                <CampoInput
                                    label="Senha"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    isError={!!zodErrors.password || !!errors.password}
                                />
                            </div>
                            <div className="col-span-2">
                                <CampoInput
                                    label="Confirmar Senha"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    isError={!!zodErrors.password_confirmation || !!errors.password_confirmation}
                                />
                            </div>
                        </div>

                        {data.password.length > 0 && (
                            <div className="col-span-2 mt-2 border border-gray-200 bg-gray-50 p-3 rounded-lg text-left">
                                <p className="mb-2 text-xs font-semibold text-gray-500">Requisitos da senha:</p>
                                <ul className="space-y-1 text-xs">
                                    {requisitosSenha.map((req, idx) => (
                                        <li key={idx} className={`flex items-center gap-2 ${req.valido ? 'font-medium text-green-600' : 'text-gray-400'}`}>
                                            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${req.valido ? 'bg-green-100' : 'bg-gray-200'}`}>
                                                {req.valido ? '✓' : '•'}
                                            </span>
                                            {req.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className={`mt-4 w-full rounded-md py-3 text-sm font-bold shadow-md transition-all duration-300 ${
                                processing ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#ff7300] hover:bg-[#cc5c00] text-white cursor-pointer'
                            }`}
                        >
                            {processing ? 'Processando...' : 'CADASTRAR'}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-[#666]">
                        Já possui uma conta?
                        <Link href="/entrar" className="ml-1 font-semibold text-[#007bff] hover:underline">Faça o Login</Link>
                    </p>
                    <p className="mt-6 text-sm text-[#666]">
                        Voltar para a
                        <Link href="/" className="ml-1 font-bold text-[#007bff] hover:underline">Tela Inicial</Link>
                    </p>
                </div>
                <AuthLogo />
            </div>
            <CustomModal modalData={modal} setModal={setModal} />
        </div>
    );
}
