import { createInertiaApp } from '@inertiajs/react';
import { Ziggy } from './ziggy';

createInertiaApp({
    strictMode: true,
    pages: {
        path: './pages',
        extension: '.tsx',
        lazy: true,
    },
    withApp(app) {
        globalThis.Ziggy = Ziggy;

        return app;
    },
});
