export const tempoPassou = (dataFim: string): boolean => {
    return new Date(dataFim) <= new Date();
};

export const formatarData = (data: string): string => {
    return new Date(data).toLocaleDateString('pt-BR');
};

export const renderizarEstrelas = (nota: number): string => {
    const estrelas = '⭐'.repeat(Math.round(nota));
    const vazias = '☆'.repeat(5 - Math.round(nota));
    return estrelas + vazias;
};
