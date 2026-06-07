import { router } from '@inertiajs/react';
import { estatisticas } from '@/routes/administracao/dashboard';

export function useDashboardFiltros(filtros: any, ano: number | string) {
    const handleFilterChange = (key: string, value: any) => {
        router.get(
            estatisticas().url,
            {
                ...filtros,
                ano,
                [key]: value,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    return {
        handleFilterChange,
    };
}
