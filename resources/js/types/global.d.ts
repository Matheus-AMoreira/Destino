import type { route as ziggyRoute } from 'ziggy-js';
import type { Auth } from '@/types/auth';

declare global {
    var route: typeof ziggyRoute;
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: Auth;
        ziggy: ReturnType<typeof ziggyRoute> & { location: string };
        [key: string]: unknown;
    }
}
