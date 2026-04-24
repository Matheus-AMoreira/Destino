export interface Pacote {
    id: number | string;
    nome: string;
    descricao: string;
    funcionario_id: number;
    pacote_foto_id?: number | null;
    fotos_do_pacote?: {
        id: number;
        nome: string;
        foto_capa: string;
        foto_capa_url: string;
        fotos?: Array<{
            id: number;
            nome: string;
            caminho: string;
            caminho_url: string;
            is_url: boolean;
        }>;
    };
    tags?: Array<{
        id: number;
        nome: string;
    }>;
    ofertas: Array<{
        id: number;
        preco: number;
        inicio: string;
        fim: string;
        disponibilidade: number;
        status: string;
        hotel?: {
            id: number;
            nome: string;
            endereco: string;
            diaria: number;
            cidade?: {
                id: number;
                nome: string;
                estado?: {
                    id: number;
                    sigla: string;
                    nome: string;
                };
            };
        };
        transporte?: {
            id: number;
            empresa: string;
            meio: string;
            preco: number;
        };
    }>;
    created_at?: string;
    updated_at?: string;
}
