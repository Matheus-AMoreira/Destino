import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { schemaCadastro, schemaResetSenha } from '@/lib/schemas';
import { limparNaoNumericos } from '@/lib/masks';
import type { ModalData } from '@/components/Modal';
import {
    cadastro as routeCadastro,
    entrar as routeEntrar,
    login as routeLogin,
} from '@/routes';
import {
    email as routeForgotPasswordEmail,
    update as routePasswordUpdate,
} from '@/routes/password';
import { send as routeVerificationSend } from '@/routes/verification';

export function useCadastro() {
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const form = useForm({
        nome: '',
        sobre_nome: '',
        cpf: '',
        telefone: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        form.transform((data) => ({
            ...data,
            cpf: limparNaoNumericos(data.cpf),
            telefone: limparNaoNumericos(data.telefone),
        }));
    }, [form.data.cpf, form.data.telefone]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schemaCadastro.safeParse(form.data);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errs[issue.path[0].toString()] = issue.message;
                }
            });
            setZodErrors(errs);
            return;
        }

        setZodErrors({});
        form.post(routeCadastro().url, {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem: 'Cadastro realizado com sucesso!',
                    url: routeEntrar().url,
                });
                form.reset();
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem: Object.values(err).join('\n'),
                    url: null,
                });
            },
        });
    };

    return {
        form,
        modal,
        setModal,
        zodErrors,
        handleSubmit,
    };
}

export function useLogin() {
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const form = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(routeLogin().url, {
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

    return {
        form,
        modal,
        setModal,
        handleSubmit,
    };
}

export function useForgotPassword() {
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const form = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(routeForgotPasswordEmail().url, {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem:
                        'Um link de recuperação foi enviado para o seu e-mail.',
                    url: null,
                });
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem:
                        err.email || 'Erro ao enviar e-mail de recuperação.',
                    url: null,
                });
            },
        });
    };

    return {
        form,
        modal,
        setModal,
        handleSubmit,
    };
}

export function useResetPassword(token: string, email: string) {
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const form = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            form.reset('password', 'password_confirmation');
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schemaResetSenha.safeParse(form.data);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0])
                    errs[issue.path[0].toString()] = issue.message;
            });
            setZodErrors(errs);
            return;
        }

        setZodErrors({});
        form.post(routePasswordUpdate().url, {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem: 'Sua senha foi redefinida com sucesso!',
                    url: routeEntrar().url,
                });
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem:
                        Object.values(err).join('\n') ||
                        'Erro ao redefinir senha.',
                    url: null,
                });
            },
        });
    };

    return {
        form,
        modal,
        setModal,
        zodErrors,
        handleSubmit,
    };
}

export function useVerifyEmail() {
    const form = useForm({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(routeVerificationSend().url);
    };

    return {
        processing: form.processing,
        handleSubmit,
    };
}
