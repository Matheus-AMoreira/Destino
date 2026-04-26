export type Role = {
    id: number;
    name: string;
    description: string | null;
    is_staff: boolean;
};

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    nome: string;
    sobre_nome: string;
    slug: string;       // slug único armazenado no banco (usado no roteamento)
    name_slug: string;  // slug cosmético computado (nome + sobrenome, para exibição)
    created_at: string;
    updated_at: string;
    role?: Role;
    role_id?: number;
    permissions?: PermissionType[];
    cpf?: string;
    is_valid: boolean;
    [key: string]: unknown;
};

export type PermissionType = {
    id: number;
    slug: string;
    description: string | null;
    is_staff: boolean;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
