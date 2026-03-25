export const formatarData = (dataIso: string) => {
    if (!dataIso) {
        return '';
    }

    const dataApenas = dataIso.includes('T') ? dataIso.split('T')[0] : dataIso;
    const [ano, mes, dia] = dataApenas.split('-');

    return `${dia}/${mes}/${ano}`;
};
