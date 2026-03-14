<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Index', [
            'pacotes' => [], // Placeholder
            'totalPaginas' => 1,
            'paginaAtual' => (int) $request->get('page', 0),
        ]);
    }

    public function entrar(): Response
    {
        return Inertia::render('Auth/Entrar');
    }

    public function cadastro(): Response
    {
        return Inertia::render('Auth/Cadastro');
    }

    public function buscar(Request $request): Response
    {
        return Inertia::render('Buscar', [
            'pacotes' => [], // Placeholder
            'filters' => [
                'termo' => $request->get('termo', ''),
                'precoMax' => (int) $request->get('precoMax', 0),
                'page' => (int) $request->get('page', 0),
                'size' => (int) $request->get('size', 12),
            ],
            'paginacao' => [
                'page' => (int) $request->get('page', 0),
                'totalPages' => 1,
                'totalElements' => 0,
            ],
        ]);
    }

    public function contato(): Response
    {
        return Inertia::render('Contato');
    }

    public function administracao(): Response
    {
        return Inertia::render('Administracao/Index');
    }

    public function administracaoDashboard(): Response
    {
        return Inertia::render('Administracao/Dashboard');
    }

    public function administracaoHotelListar(): Response
    {
        return Inertia::render('Administracao/Hotel/Listar');
    }

    public function administracaoHotelRegistrar(): Response
    {
        return Inertia::render('Administracao/Hotel/Registrar');
    }

    public function administracaoPacoteListar(): Response
    {
        return Inertia::render('Administracao/Pacote/Listar');
    }

    public function administracaoPacoteRegistrar(): Response
    {
        return Inertia::render('Administracao/Pacote/Registrar');
    }

    public function administracaoPacotedefotoListar(): Response
    {
        return Inertia::render('Administracao/Pacotedefoto/Listar');
    }

    public function administracaoPacotedefotoRegistrar(): Response
    {
        return Inertia::render('Administracao/Pacotedefoto/Registrar');
    }

    public function administracaoTransporteListar(): Response
    {
        return Inertia::render('Administracao/Transporte/Listar');
    }

    public function administracaoTransporteRegistrar(): Response
    {
        return Inertia::render('Administracao/Transporte/Registrar');
    }

    public function administracaoUsuarioListar(): Response
    {
        return Inertia::render('Administracao/Usuario/Listar');
    }

    public function checkout(): Response
    {
        return Inertia::render('Checkout/Index');
    }

    public function checkoutConfirmacao(string $compraId): Response
    {
        return Inertia::render('Checkout/Confirmacao', [
            'compraId' => $compraId,
        ]);
    }

    public function pacote(string $nome): Response
    {
        return Inertia::render('Pacote/Detalhes', [
            'nome' => $nome,
            'pacote' => null, // Placeholder
        ]);
    }

    public function usuarioViagemListar(string $usuario): Response
    {
        return Inertia::render('Usuario/Viagem/Listar', [
            'usuario' => $usuario,
        ]);
    }

    public function usuarioViagemListarId(string $usuario, string $id): Response
    {
        return Inertia::render('Usuario/Viagem/Detalhes', [
            'usuario' => $usuario,
            'id' => $id,
        ]);
    }
}
