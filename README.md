<p align="center">
    <img src="public/assets/icons/favicon.svg" width="200" alt="Destino Logo">
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

## 📁 Estrutura do Projeto

O backend do projeto adota uma arquitetura de **Monólito Modular Pragmático**, onde as classes do Laravel são categorizadas por sua responsabilidade técnica e organizadas internamente por **módulos de negócio**. 

### Divisão de Pastas no Laravel (`app/`)

Abaixo está o detalhamento de cada diretório e seu papel na arquitetura:

*   **`Actions/`**: Concentra a lógica de escrita do sistema. Cada ação representa um caso de uso de escrita único e focado (ex: `CriarHotelAction`), isolando mutações e facilitando testes unitários.
*   **`Casts/`**: Classes de mapeamento de tipos customizados do Eloquent. Utilizado para criptografar/descriptografar CPF de forma invisível (`CpfCast`).
*   **`Console/`**: Comandos customizados do Artisan executados via CLI (ex: comando de importação de dados geográficos).
*   **`DTOs/`**: *Data Transfer Objects* responsáveis por estruturar o tráfego de dados de forma fortemente tipada entre controladores, ações e repositórios.
*   **`Enums/`**: Enums nativos do PHP que centralizam estados fixos e categorizações do sistema (ex: status de ofertas).
*   **`Http/`**: Camada HTTP que lida com a entrega externa:
    *   `Controllers/`: Processam as requisições e renderizam telas do React ou respondem requisições de API.
    *   `Middleware/`: Filtros de requisições, como proteção de rotas administrativas e controle de acessos da UI.
    *   `Requests/`: Validações de formulários e regras de input robustas.
*   **`Models/`**: Entidades e mapeamento de tabelas utilizando o Eloquent ORM.
*   **`Observers/`**: Eventos Eloquent que interceptam ações do ciclo de vida dos modelos para automações colaterais (ex: logs de auditoria).
*   **`Providers/`**: Inicializadores e registradores de serviços do framework.
*   **`Repositories/`**: Encapsulam consultas e lógica de leitura de dados, desacoplando o controller do acesso direto à query builders complexos.
*   **`Services/`**: Agrupam serviços de infraestrutura ou lógicas transversais que não pertencem a uma única entidade (ex: geração de gráficos e relatórios).
*   **`ValueObjects/`**: Objetos de valor imutáveis que garantem consistência e integridade a um dado (ex: `Cpf`).
*   **`ViewModels/`**: Preparam e transformam dados estruturados especificamente para as telas do React (Inertia), aliviando lógica de mapeamento dos controllers.

### Módulos de Negócio (Organização Interna)

Para facilitar a manutenibilidade e escalabilidade do código, todas as pastas técnicas listadas acima dividem seus arquivos internamente nos seguintes **módulos**:

1.  **`Catalogo`**: Gerenciamento de Pacotes de Viagem, Álbuns de Fotos e Tags.
2.  **`Comercial`**: Fluxos de Compra, Ofertas, Carrinho, Checkout e Avaliações de usuários.
3.  **`Geografia`**: Estrutura territorial com Regiões, Estados e Cidades (populadas via IBGE).
4.  **`Hospedagem`**: Gestão de Hotéis e Transportes.
5.  **`Identidade`**: Usuários, Perfis, Controle de Acesso (Roles e Permissões).
6.  **`Shared`**: Componentes e utilitários transversais consumidos por múltiplos módulos.

---

## 🚀 Guia de Início Rápido

Siga os passos abaixo para configurar o projeto em seu ambiente local.

### 1. Instalação de Dependências

Primeiro, instale as dependências do PHP (Composer) e do Node.js (pnpm):

```bash
composer install
pnpm install
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
*   **Containers:** O Docker Compose utiliza o arquivo `.env.docker`.

### 3. Migrações e Dados Geográficos

Prepare o banco de dados e importe as tabelas do IBGE:

```bash
php artisan migrate
php artisan app:import-ibge
```

---

## 🛠 Desenvolvimento

Você pode rodar a aplicação de duas formas:

### ⚡ Local (PHP e PNPM)
Ideal para desenvolvimento rápido com SSR habilitado. Abra dois terminais:

```bash
# Terminal 1: Servidor Web
php artisan serve

# Terminal 2: SSR Render
pnpm run dev
```

### 🐳 Container (Docker/Podman)
Recomendado para validar a build final.

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
- **Frontend**: React 19, Inertia.js v3
- **Estilização**: Tailwind CSS v4
- **Interface**: Lucide Icons
- **Roteamento**: Laravel Wayfinder
- **Banco de Dados**: PostgreSQL 18
- **Testes**: Pest PHP 4
- **Build Tool**: Vite 8 & Composer 2
