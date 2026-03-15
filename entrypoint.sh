#!/bin/sh

# Esperar um pouco para garantir que a rede esteja estável (opcional para DBs externos)
echo "Aguardando inicialização..."

# Reseta ar configurações para aceitar as variaveis de ambiente
php artisan config:clear

# Rodar as migrações (o --force é obrigatório em produção)
php artisan migrate --force

# Rodar o seu comando específico do IBGE
echo "Importando dados do IBGE..."
php artisan app:import-ibge

# Iniciar o PHP-FPM em background e o Nginx em foreground
php-fpm -D
nginx -g 'daemon off;'
