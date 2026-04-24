FROM php:8.5-fpm-alpine AS base

RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    icu-dev \
    oniguruma-dev

RUN docker-php-ext-install pdo pdo_pgsql bcmath zip intl mbstring

FROM base AS builder

WORKDIR /app

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY --from=node:24-alpine /usr/local/bin /usr/local/bin
COPY --from=node:24-alpine /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN corepack enable pnpm && corepack prepare pnpm@latest --activate

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runtime_php

WORKDIR /app

COPY --from=builder /app/vendor ./vendor
COPY --from=builder /app/public/build ./public/build
COPY . .

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

FROM node:24-alpine AS runtime_node

WORKDIR /app

COPY --from=builder /app/bootstrap/ssr ./bootstrap/ssr
COPY --from=builder /app/public/build ./public/build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 13714
CMD ["node", "bootstrap/ssr/app.js"]
