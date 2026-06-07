import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    interface PageProps {
        auth: Auth;
        [key: string]: unknown;
    }
}
