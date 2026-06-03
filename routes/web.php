<?php

use Illuminate\Support\Facades\Route;

// Rotas Públicas (Home, Busca, Detalhes, Autenticação de Convidados, etc.)
require __DIR__.'/public.php';

// Rotas Privadas do Usuário (Perfil, Checkout, Viagens, API de Avaliações)
require __DIR__.'/user.php';

// Rotas Privadas da Administração (Dashboard, Hoteis, Transportes, Pacotes, Usuários, etc.)
require __DIR__.'/admin.php';
