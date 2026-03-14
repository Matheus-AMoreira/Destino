export type User = {
    id: string;
    nome: string;
    sobre_nome: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
