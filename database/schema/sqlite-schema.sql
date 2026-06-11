-- SQLite Schema dump for testing

CREATE TABLE IF NOT EXISTS "migrations" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "migration" VARCHAR(255) NOT NULL,
    "batch" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "permissions" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "description" VARCHAR(255),
    "is_staff" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "user_permissions" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "user_id" VARCHAR(255) NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "roles" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" VARCHAR(255),
    "is_staff" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" VARCHAR(255) PRIMARY KEY,
    "nome" VARCHAR(20) NOT NULL,
    "sobre_nome" VARCHAR(20) NOT NULL,
    "cpf" TEXT NOT NULL UNIQUE,
    "email" VARCHAR(50) NOT NULL UNIQUE,
    "telefone" VARCHAR(11) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT 0,
    "email_verified_at" DATETIME,
    "remember_token" VARCHAR(100),
    "role_id" INTEGER,
    "slug" VARCHAR(255),
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "regiaos" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "sigla" VARCHAR(2) NOT NULL,
    "nome" VARCHAR(12) NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

CREATE TABLE IF NOT EXISTS "estados" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "sigla" VARCHAR(2) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "regiao_id" INTEGER,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("regiao_id") REFERENCES "regiaos" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "cidades" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nome" VARCHAR(40) NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("estado_id") REFERENCES "estados" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "hotels" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nome" VARCHAR(50) NOT NULL,
    "endereco" VARCHAR(100) NOT NULL,
    "diaria" INTEGER NOT NULL,
    "cidade_id" INTEGER NOT NULL,
    "cep" VARCHAR(9),
    "cep_data" TEXT,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("cidade_id") REFERENCES "cidades" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "transportes" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "empresa" VARCHAR(100) NOT NULL,
    "meio" VARCHAR(255) NOT NULL,
    "preco" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

CREATE TABLE IF NOT EXISTS "pacote_fotos" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nome" VARCHAR(255) NOT NULL,
    "storage_type" VARCHAR(255) NOT NULL DEFAULT 'local',
    "foto_capa" TEXT NOT NULL,
    "is_url" BOOLEAN NOT NULL DEFAULT 0,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

CREATE TABLE IF NOT EXISTS "pacotes" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT NOT NULL,
    "funcionario_id" VARCHAR(255) NOT NULL,
    "pacote_foto_id" INTEGER,
    "tag_ids" TEXT,
    "media_avaliacao" NUMERIC(3,2) DEFAULT NULL,
    "total_avaliacoes" INTEGER DEFAULT 0,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("funcionario_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("pacote_foto_id") REFERENCES "pacote_fotos" ("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "ofertas" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "preco" NUMERIC(10,2) NOT NULL,
    "inicio" DATE NOT NULL,
    "fim" DATE NOT NULL,
    "disponibilidade" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT 1,
    "pacote_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "transporte_id" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("pacote_id") REFERENCES "pacotes" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("hotel_id") REFERENCES "hotels" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("transporte_id") REFERENCES "transportes" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "compras" (
    "id" VARCHAR(255) PRIMARY KEY,
    "data_compra" DATETIME NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "metodo" VARCHAR(255) NOT NULL,
    "processador_pagamento" VARCHAR(255) NOT NULL,
    "parcelas" INTEGER NOT NULL,
    "valor_final" NUMERIC(10,2) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "oferta_id" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("oferta_id") REFERENCES "ofertas" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "tags" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nome" VARCHAR(255) NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

CREATE TABLE IF NOT EXISTS "pacote_tag" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "pacote_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("pacote_id") REFERENCES "pacotes" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "avaliacoes" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nota" INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    "comentario" TEXT,
    "user_id" VARCHAR(255) NOT NULL,
    "pacote_id" INTEGER NOT NULL,
    "compra_id" VARCHAR(255) NOT NULL UNIQUE,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("pacote_id") REFERENCES "pacotes" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("compra_id") REFERENCES "compras" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "activity_log" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "log_name" VARCHAR(255),
    "description" TEXT NOT NULL,
    "subject_type" VARCHAR(255),
    "subject_id" VARCHAR(255),
    "event" VARCHAR(255),
    "causer_type" VARCHAR(255),
    "causer_id" VARCHAR(255),
    "attribute_changes" TEXT,
    "properties" TEXT,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" VARCHAR(255) PRIMARY KEY,
    "user_id" VARCHAR(255),
    "target_user_id" VARCHAR(255),
    "action" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "changes" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" DATETIME,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL,
    FOREIGN KEY ("target_user_id") REFERENCES "users" ("id") ON DELETE SET NULL
);
