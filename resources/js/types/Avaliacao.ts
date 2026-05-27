export interface Avaliacao {
    id: number;
    nota: number;
    comentario: string | null;
    user_id: string;
    nomeUsuario: string;
    pacote_id: number;
    created_at: string;
}

export interface AvaliacaoPacote {
    notaMedia: number;
    quantidadeAvaliacoes: number;
    avaliacoes: Avaliacao[];
}

export interface CreateAvaliacaoPayload {
    pacote_id: number;
    compra_id: string;
    nota: number;
    comentario?: string;
}

export interface UpdateAvaliacaoPayload {
    nota?: number;
    comentario?: string;
}
