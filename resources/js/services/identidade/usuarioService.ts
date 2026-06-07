import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ModalData } from '@/components/Modal';
import { limparNaoNumericos } from '@/lib/masks';
import { schemaPerfilAdmin, schemaRegistrarStaff } from '@/lib/schemas';
import {
    destroy,
    index,
    resendInvitation,
    store,
    update,
    updateStatus,
} from '@/routes/administracao/usuario';
import type { User } from '@/types/auth';

export function useUsuarioList(initialTermo: string, tab: string) {
    const [termo, setTermo] = useState(initialTermo || '');
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });

    const handleSearch = (e: SubmitEvent) => {
        e.preventDefault();
        router.get(index().url, { termo, tab }, { preserveState: true });
    };

    const handleTabChange = (newTab: string) => {
        router.get(
            index().url,
            { termo, tab: newTab },
            { preserveState: true },
        );
    };

    const handleResendInvitation = (id: string | number) => {
        router.post(
            resendInvitation({ user: id }).url,
            {},
            {
                onSuccess: () =>
                    setModal({
                        show: true,
                        mensagem: 'Novo convite enviado!',
                        url: null,
                    }),
            },
        );
    };

    const handleToggleBlock = (id: string | number, currentStatus: boolean) => {
        router.patch(
            updateStatus({ id }).url,
            { is_valid: !currentStatus },
            {
                onSuccess: () =>
                    setModal({
                        show: true,
                        mensagem: 'Status do usuário atualizado.',
                        url: null,
                    }),
            },
        );
    };

    const handleAprovar = (id: string | number) => {
        router.patch(
            updateStatus({ id }).url,
            { is_valid: true },
            {
                onSuccess: () =>
                    setModal({
                        show: true,
                        mensagem: 'Usuário aprovado com sucesso!',
                        url: null,
                    }),
            },
        );
    };

    const handleDelete = (id: string | number) => {
        router.delete(destroy({ id }).url, {
            onSuccess: () =>
                setModal({
                    show: true,
                    mensagem: 'Usuário removido.',
                    url: null,
                }),
        });
    };

    return {
        termo,
        setTermo,
        modal,
        setModal,
        handleSearch,
        handleTabChange,
        handleResendInvitation,
        handleToggleBlock,
        handleAprovar,
        handleDelete,
    };
}

export function useUsuarioRegistrar(initialRoleId: string | number) {
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const form = useForm({
        nome: '',
        sobre_nome: '',
        email: '',
        cpf: '',
        telefone: '',
        role_id: initialRoleId,
    });

    useEffect(() => {
        form.transform((data) => ({
            ...data,
            cpf: limparNaoNumericos(data.cpf),
            telefone: limparNaoNumericos(data.telefone),
        }));
    }, [form.transform]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schemaRegistrarStaff.safeParse(form.data);

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
        form.post(store().url, {
            onSuccess: () => {
                setModal({
                    show: true,
                    mensagem:
                        'Funcionário cadastrado com sucesso! O convite foi enviado ao e-mail informado.',
                    url: index().url,
                });
            },
            onError: (err) => {
                setModal({
                    show: true,
                    mensagem:
                        'Erro ao cadastrar funcionário. ' +
                        Object.values(err).join(', '),
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

export function useUsuarioDetalhes(usuario: User) {
    const [activeTab, setActiveTab] = useState<
        'perfil' | 'acesso' | 'historico'
    >('historico');
    const [statusFilter, setStatusFilter] = useState<string>('TODOS');
    const [modal, setModal] = useState<ModalData>({
        show: false,
        mensagem: '',
        url: null,
    });
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const perfilForm = useForm({
        nome: usuario.nome,
        sobre_nome: usuario.sobre_nome,
        email: usuario.email,
        cpf: '',
        telefone: usuario.telefone || '',
    });

    useEffect(() => {
        perfilForm.transform((data) => {
            const transformed: Record<string, string> = {
                ...data,
                telefone: limparNaoNumericos(data.telefone),
            };
            const cpfClean = limparNaoNumericos(data.cpf);
            if (cpfClean.length > 0) {
                transformed.cpf = cpfClean;
            } else {
                delete transformed.cpf;
            }
            return transformed as any;
        });
    }, [perfilForm.transform]);

    const acessoForm = useForm({
        role_id: usuario.role?.id || '',
        permissions: usuario.permissions?.map((p) => p.id) || [],
    });

    const handleUpdatePerfil = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schemaPerfilAdmin.safeParse(perfilForm.data);
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
        perfilForm.put(update({ id: usuario.id }).url, {
            onSuccess: () =>
                setModal({
                    show: true,
                    mensagem: 'Perfil atualizado com sucesso!',
                    url: null,
                }),
        });
    };

    const handleUpdateAccess = (e: React.FormEvent) => {
        e.preventDefault();
        acessoForm.put(update({ id: usuario.id }).url, {
            onSuccess: () =>
                setModal({
                    show: true,
                    mensagem: 'Acessos sincronizados com sucesso!',
                    url: null,
                }),
        });
    };

    return {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        modal,
        setModal,
        zodErrors,
        perfilForm,
        acessoForm,
        handleUpdatePerfil,
        handleUpdateAccess,
    };
}
