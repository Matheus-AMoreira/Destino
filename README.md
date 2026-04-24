# Destino - Sistema de Pacotes de Viagem

Este é um projeto Laravel 12 com Inertia.js v2, React 19 e Tailwind CSS v4 para gerenciamento de pacotes de viagem e álbuns de fotos.

## Desenvolvimento
Para a aplicação vereficaro funcionamento da aplicação você deve usar php artisan serve junto ao pnpm run dev, isso fará com que o node cuidade de renderizar a página que o laravel vai entregar na requisição

## 🚀 Guia de Início Rápido

Para rodar o projeto localmente usando Docker, siga os passos abaixo:

### 1. Clonar o Repositório e Configurar Env
```bash
git clone https://github.com/Matheus-AMoreira/Destino.git
cd Destino
cp .env.example .env
```

### 2. Subir os Containers
```bash
docker-compose up -d
```
O projeto estará disponível em `http://localhost:8000`.

### 3. Instalar Dependências e Gerar Chave
```bash
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
pnpm install
```

### 4. Bancos de Dados e Migrações
```bash
docker-compose exec app php artisan migrate
```

### 5. Carga de Dados Geográficos (IBGE)
Para preencher as tabelas de Regiões, Estados e Cidades, utilize o comando customizado:
```bash
docker-compose exec app php artisan app:import-ibge
```

## 📚 Tecnologias Utilizadas (Stack)

- **Backend**: PHP 8.5.4, Laravel 13
- **Frontend**: React 19, Inertia v3
- **Estilização**: Tailwind CSS v4
- **Ícones**: Lucide React
- **Roteamento Frontend**: Laravel Wayfinder
- **Banco de Dados**: PostgreSQL
- **Testes**: Pest PHP 4
- **Bundler**: Vite
