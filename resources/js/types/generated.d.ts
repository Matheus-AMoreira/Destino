declare namespace App {
    namespace DTOs {
        namespace Comercial {
            export type AvaliacaoDTO = {
                readonly id: number;
                readonly nota: number;
                readonly comentario: string | null;
                readonly user_id: string;
                readonly nomeUsuario: string;
                readonly pacote_id: number;
                readonly created_at: string | null;
            };
            export type AvaliacaoPacoteDTO = {
                readonly notaMedia: number;
                readonly quantidadeAvaliacoes: number;
                readonly avaliacoes: App.DTOs.Comercial.AvaliacaoDTO[];
            };
            export type CheckoutDTO = {
                readonly id: number;
                readonly preco: number;
                readonly inicio: string;
                readonly fim: string;
                readonly disponibilidade: number;
                readonly pacote: {
                    nome: string;
                    fotos_do_pacote: {
                        foto_capa_url: string;
                    } | null;
                } | null;
                readonly hotel: {
                    nome: string;
                    cidade: {
                        nome: string;
                        estado: {
                            sigla: string;
                        };
                    };
                } | null;
            };
        }
        namespace Shared {
            export type AtividadeRecenteDTO = {
                readonly id: number;
                readonly description: string;
                readonly time: string;
                readonly causer: string;
            };
            export type DadosGraficosDTO = {
                readonly compras: Array<any>;
                readonly destinosPopulares: Array<any>;
                readonly crescimentoUsuarios: Array<any>;
                readonly anosDisponiveis: Array<any>;
            };
            export type EstatisticasDTO = {
                readonly usuarios: number;
                readonly hoteis: number;
                readonly transportes: number;
                readonly pacotes: number;
                readonly ofertas: number;
            };
        }
    }
    namespace Enums {
        namespace Comercial {
            export type Metodo = "VISTA" | "PARCELADO";
            export type OfertaStatus =
                | "CONCLUIDO"
                | "EMANDAMENTO"
                | "CANCELADO";
            export type Processador = "VISA" | "MASTERCARD" | "UOL" | "PIX";
            export type StatusCompra = "pending" | "rejected" | "approved";
        }
        namespace Hospedagem {
            export type Meio = "AEREO" | "TERRESTRE" | "MARITIMO";
        }
        namespace Identidade {
            export type UserAuthority =
                | "DELETAR_USUARIO"
                | "CRIAR_PACOTE"
                | "EDICAO_PERFIL";
            export type UserRole = "USUARIO" | "FUNCIONARIO" | "ADMINISTRADOR";
        }
    }
    namespace ViewModels {
        namespace Catalogo {
            export type PacoteCardViewModel = {
                readonly id: number;
                readonly nome: string;
                readonly descricao: string;
                readonly fotos_do_pacote: {
                    foto_capa_url: string | null;
                } | null;
                readonly tags: {
                    id: number;
                    nome: string;
                }[];
                readonly active_ofertas_count: number;
                readonly media_avaliacao: number | null;
                readonly total_avaliacoes: number;
                readonly cheapest_active_offer: {
                    preco: number;
                    inicio: string;
                    fim: string;
                } | null;
            };
            export type PacoteDetalhesViewModel = {
                readonly id: number;
                readonly nome: string;
                readonly descricao: string;
                readonly fotos_do_pacote: {
                    foto_capa_url: string;
                    fotos: {
                        id: number;
                        caminho_url: string;
                        is_url: boolean;
                        ordem: number;
                    }[];
                } | null;
                readonly tags: {
                    id: number;
                    nome: string;
                }[];
                readonly ofertas: Array<any>;
                readonly active_ofertas_count: number;
                readonly media_avaliacao: number | null;
                readonly total_avaliacoes: number;
                readonly cheapest_active_offer: {
                    preco: number;
                } | null;
                readonly latest_offer: {
                    id: number;
                    preco: number;
                    inicio: string;
                    fim: string;
                    disponibilidade: number;
                    status: string;
                    isAvailable: boolean;
                    hotel: {
                        id: number;
                        nome: string;
                        endereco: string;
                        diaria: number;
                        cidade: {
                            id: number;
                            nome: string;
                            estado: {
                                id: number;
                                nome: string;
                                sigla: string;
                            };
                        };
                    } | null;
                    transporte: {
                        id: number;
                        empresa: string;
                        meio: string;
                        preco: number;
                    } | null;
                } | null;
            };
        }
    }
}
