import { useForm } from '@inertiajs/react';
import type { SubmitEventHandler } from 'react';
import { useEffect, useState } from 'react';
import type { ModalData } from '@/components/Modal';
import {
    formatarCPF,
    formatarTelefone,
    limparNaoNumericos,
    mascararCPF,
} from '@/lib/masks';
import { schemaPerfil, schemaSenha } from '@/lib/schemas';
import {
    password as routeProfilePassword,
    update as routeProfileUpdate,
} from '@/routes/user/profile';

export function usePerfil(user: any) {
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});
    const [showFullCpf, setShowFullCpf] = useState(false);
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const form = useForm({
        nome: user?.nome || '',
        sobre_nome: user?.sobre_nome || '',
        email: user?.email || '',
        cpf: user?.cpf || '',
        telefone: user?.telefone || '',
    });

    useEffect(() => {
        form.transform((data) => ({
            ...data,
            cpf: limparNaoNumericos(data.cpf),
            telefone: limparNaoNumericos(data.telefone),
        }));
    }, [form.transform]);

    const handleChange = (campo: string, valor: string) => {
        const raw = limparNaoNumericos(valor);
        if (campo === 'cpf') {
            form.setData('cpf', raw.substring(0, 11));
        } else if (campo === 'telefone') {
            form.setData('telefone', raw.substring(0, 11));
        } else {
            form.setData(campo as any, valor);
        }
    };

    const cpfFormatado = showFullCpf
        ? formatarCPF(form.data.cpf)
        : mascararCPF(form.data.cpf);

    const telefoneFormatado = formatarTelefone(form.data.telefone);

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();

        const result = schemaPerfil.safeParse(form.data);
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
        form.put(routeProfileUpdate().url, {
            preserveScroll: true,
            onSuccess: () =>
                setModal({
                    show: true,
                    mensagem: 'Perfil atualizado com sucesso!',
                    url: null,
                }),
            onError: (err) =>
                setModal({
                    show: true,
                    mensagem: Object.values(err).join('\n'),
                    url: null,
                }),
        });
    };

    return {
        form,
        zodErrors,
        showFullCpf,
        setShowFullCpf,
        cpfFormatado,
        telefoneFormatado,
        handleChange,
        submit,
        modal,
        setModal,
    };
}

// ---------------------------------------------------------------------------
// useSenha — dados e submit da troca de senha
// ---------------------------------------------------------------------------

export function useSenha() {
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();

        const result = schemaSenha.safeParse(form.data);
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
        form.put(routeProfilePassword().url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setModal({
                    show: true,
                    mensagem: 'Senha alterada com sucesso!',
                    url: null,
                });
            },
            onError: (err) =>
                setModal({
                    show: true,
                    mensagem: Object.values(err).join('\n'),
                    url: null,
                }),
        });
    };

    return { form, zodErrors, submit, modal, setModal };
}
