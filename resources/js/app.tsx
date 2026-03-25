import { createInertiaApp } from '@inertiajs/react';
import type { ReactComponent } from 'node_modules/@inertiajs/react/types/types';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'App';

const pages = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    strictMode: true,

    resolve: async (name): Promise<ReactComponent> => {
        const mod = (await pages[`./pages/${name}.tsx`]?.()) as {
            default: ReactComponent;
        };

        if (!mod) {
            throw new Error(`Página não encontrada: ${name}`);
        }

        return mod.default;
    },

    setup({ el, App, props }) {
        if (!el) {
            throw new Error('Root element not found');
        }

        createRoot(el).render(<App {...props} />);
    },

    progress: { color: '#4B5563' },
});
