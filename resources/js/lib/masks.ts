export const formatarCPF = (val: string) =>
    val
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        .substring(0, 14);

export const formatarTelefone = (val: string) =>
    val
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        .substring(0, 15);

export const limparNaoNumericos = (val: string) => val.replace(/\D/g, '');
