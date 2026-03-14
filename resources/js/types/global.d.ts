import { route as ziggyRoute } from 'ziggy-js';
import type { Auth } from '@/types/auth';

declare global {
    var route: typeof ziggyRoute;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            auth: Auth;
            ziggy: any;
            [key: string]: unknown;
        };
    }
}
