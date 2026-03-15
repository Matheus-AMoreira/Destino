# STAGE 1: Build
FROM node:24-alpine AS build-stage

RUN apk add --no-cache \
    php84 php84-common php84-mbstring php84-xml php84-curl \
    php84-openssl php84-tokenizer php84-phar php84-pdo \
    php84-dom php84-xmlwriter php84-session php84-ctype \
    php84-iconv php84-fileinfo curl

RUN ln -sf /usr/bin/php84 /usr/bin/php
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN npm install -g pnpm

WORKDIR /app

# Ativar extensões no build stage
RUN mkdir -p /etc/php84/conf.d/ && \
    for ext in curl mbstring openssl tokenizer xml dom xmlwriter session ctype iconv fileinfo; do \
    echo "extension=$ext" > "/etc/php84/conf.d/00_$ext.ini"; \
    done

# Copiar apenas os arquivos de definição primeiro (aproveita o cache do Docker)
COPY composer.json composer.lock pnpm-lock.yaml package.json ./

RUN composer install --no-dev --optimize-autoloader --no-scripts --no-autoloader
RUN pnpm install

# Agora copia o resto e finaliza
COPY . .
RUN composer dump-autoload --optimize
RUN pnpm build

# ---------------------------------------------------------
# STAGE 2: Produção
# ---------------------------------------------------------
FROM php:8.5.4-fpm-alpine

RUN apk add --no-cache libpq-dev nginx supervisor
RUN docker-php-ext-install pdo pdo_pgsql

# Configurações de PHP (Upload de 100MB conforme solicitado)
RUN echo "client_max_body_size 100M;" > /usr/local/etc/php/conf.d/uploads.ini
RUN echo -e "upload_max_filesize=100M\npost_max_size=100M" > /usr/local/etc/php/conf.d/limit.ini

# Copia a config do Nginx que você postou
COPY ./nginx.conf /etc/nginx/http.d/default.conf

WORKDIR /var/www/html

# Copia o resultado do build
COPY --from=build-stage /app /var/www/html

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Permissões cruciais para o Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Gera a chave e limpa caches de rota/configuração
RUN php artisan key:generate --force
RUN php artisan config:cache
RUN php artisan route:cache

# Ajusta permissões novamente para garantir que os arquivos criados acima sejam acessíveis
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]

ENTRYPOINT ["entrypoint.sh"]
