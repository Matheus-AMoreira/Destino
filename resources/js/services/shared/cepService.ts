export interface CepResponse {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
    location?: {
        type: string;
        coordinates: {
            longitude: string;
            latitude: string;
        };
    };
}

export async function obterDadosCep(cep: string): Promise<CepResponse> {
    const raw = cep.replace(/\D/g, '');
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${raw}`);
    if (!response.ok) {
        throw new Error('CEP não encontrado');
    }
    return response.json();
}
