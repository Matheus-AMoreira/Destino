import { z } from 'zod';

export const passwordRules = z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Uma letra maiúscula é obrigatória')
    .regex(/[a-z]/, 'Uma letra minúscula é obrigatória')
    .regex(/\d/, 'Um número é obrigatório')
    .regex(/[@$!%*?&#\-_]/, 'Um caractere especial (@$!%*?&#-_) é obrigatório');

export const userBaseSchema = {
    nome: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, 'Apenas letras'),
    sobre_nome: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/, 'Apenas letras'),
    cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
    telefone: z.string().min(10, 'Telefone inválido').max(11, 'Telefone inválido').optional().or(z.literal('')),
    email: z.string().email('E-mail inválido'),
};

export const schemaCadastro = z
    .object({
        ...userBaseSchema,
        password: passwordRules,
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'As senhas não coincidem',
        path: ['password_confirmation'],
    });

export const schemaPerfil = z.object({
    ...userBaseSchema,
});

export const schemaSenha = z.object({
    current_password: z.string().min(1, 'Senha atual é obrigatória'),
    password: passwordRules,
    password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation']
});

export const schemaResetSenha = z.object({
    email: z.string().email('E-mail inválido'),
    password: passwordRules,
    password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation']
});

export const schemaRegistrarStaff = z.object({
    ...userBaseSchema,
    role_id: z.coerce.number().min(1, 'Selecione um cargo'),
});
