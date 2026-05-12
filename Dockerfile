FROM php:8.5-fpm-alpine

WORKDIR /app

RUN apk add --no-cache git unzip icu-dev

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions \
    zip \
    pdo_pgsql \
    pgsql \
    bcmath \
    gd \
    opcache \
    intl

# Pegar o node e o corepak direto da image
COPY --from=node:24-alpine /usr/local/bin/node /usr/local/bin/node
COPY --from=node:24-alpine /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack

# pegar o composer da imagem official
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# copia o projeto
COPY . .

# Instalação da dependencias do php
RUN composer install --no-dev --optimize-autoloader

# Habilitando o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Instalação da dependencias do node
RUN pnpm install --frozen-lockfile && pnpm run build

# Ajuste de permissão
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]