export interface Pacote {
    id: number | string;
    nome: string;
    descricao: string;
    funcionario_id: number;
    pacote_foto_id?: number | null;
    fotosDoPacote?: {
        id: number;
        nome: string;
        fotoDoPacote: string;
        fotos?: Array<{
            id: number;
            nome: string;
            url: string;
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
