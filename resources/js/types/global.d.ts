import type { Config, route as routeFn } from 'ziggy-js';
import type { Auth } from '@/types/auth';

declare global {
    var route: typeof routeFn;
    var Ziggy: Config;
}

declare module 'ziggy-js' {
    interface TypeConfig {
        strictRouteNames: true;
    }
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: Auth;
        [key: string]: unknown;
    }
}
