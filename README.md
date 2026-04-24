<p align="center">
    <img src="public/favicon.svg" width="200" alt="Destino Logo">
</p>

<h1 align="center">Destino</h1>

<p align="center">
    Projeto Integrador da equipe Tech6 do 5 ADS do primeiro semestre de 2026 da Fatec Guaratinguetá
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.5+-8892BF?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 🚀 Guia de Início Rápido

Siga os passos abaixo para configurar o projeto em seu ambiente local.

### 1. Instalação de Dependências

Primeiro, instale as dependências do PHP (Composer) e do Node.js (pnpm):

```bash
composer install
pnpm install
pnpm run build
```

### 2. Configuração do Ambiente (`.env`)

Crie o seu arquivo de configuração e gere a chave da aplicação.

> [!IMPORTANT]
> **Nunca utilize a conexão do banco de dados de produção localmente.**
> As chaves de criptografia serão diferentes e as senhas existentes no banco de produção não coincidirão com a sua chave local.

```bash
cp .env.example .env
php artisan key:generate
```

*   **Ambiente Local:** Utilize o arquivo `.env`.
*   **Containers:** O Docker Compose utiliza o arquivo `.env.docker` automaticamente.

### 3. Migrações e Dados Geográficos

Prepare o banco de dados e importe as tabelas do IBGE:

```bash
php artisan migrate
php artisan app:import-ibge
```

---

## 🛠 Desenvolvimento

Você pode rodar a aplicação de duas formas:

### ⚡ Modo Local (PHP Artisan)
Ideal para desenvolvimento rápido com SSR habilitado. Abra dois terminais:

```bash
# Terminal 1: Servidor Web
php artisan serve

# Terminal 2: SSR Render
php artisan inertia:start-ssr
```

### 🐳 Modo Container (Docker/Podman)
Recomendado para validar o build final e orquestração com Nginx.

```bash
# Com Docker
docker compose up -d

# Com Podman
podman compose build
podman compose up -d
```

---

## 🏗 Stack Tecnológica

O **Destino** utiliza as tecnologias mais recentes para garantir performance e manutenibilidade:

- **Core**: PHP 8.5+, Laravel 13
- **Frontend**: React 19, Inertia.js v3 (SSR)
- **Estilização**: Tailwind CSS v4
- **Interface**: Lucide React Icons
- **Roteamento**: Ziggy & Laravel Wayfinder
- **Banco de Dados**: PostgreSQL 18
- **Testes**: Pest PHP 4
- **Build Tool**: Vite 8 & Composer 2
