import { exec } from 'node:child_process';
import path from 'node:path';
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx','resources/css/app.css'],
            refresh: true,
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        {
            name: 'laravel-typescript-transformer',
            handleHotUpdate({ file }) {
                if (
                    file.includes('app/DTOs') ||
                    file.includes('app/Enums') ||
                    file.includes('app/ViewModels')
                ) {
                    console.log('\n[Vite] PHP data structure changed. Regenerating TypeScript types...');
                    exec('php artisan typescript:transform', (err, stdout, stderr) => {
                        if (err) {
                            console.error(`[Vite] TypeScript generation failed: ${stderr || err.message}`);
                        } else {
                            console.log('[Vite] TypeScript types generated successfully.');
                        }
                    });
                }
            },
        },
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});
