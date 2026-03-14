<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\User;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RouteController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Index', [
            'pacotes' => [],
            'totalPaginas' => 1,
            'paginaAtual' => (int) $request->get('page', 0),
        ]);
    }

    public function buscar(Request $request): Response
    {
        return Inertia::render('Buscar', [
            'pacotes' => [],
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
        return redirect()->route('administracao.dashboard');
    }

    public function administracaoDashboard(): Response
    {
        return Inertia::render('Administracao/Dashboard');
    }

    public function administracaoUsuarioListar(): Response
    {
        return Inertia::render('Administracao/Usuarios', [
            'usuarios' => Usuario::all(),
        ]);
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

    public function usuarioViagemListar(Request $request, string $usuario): Response
    {
        $view = $request->query('view', 'andamento');
        $user = auth()->user();

        $query = Compra::with(['oferta.pacote.fotosDoPacote.fotos', 'oferta.pacote.hotel.cidade.estado', 'oferta.transporte', 'oferta.pacote.tags'])
            ->where('user_id', $user->id);

        if ($view === 'concluidas') {
            $query->whereHas('oferta', function ($q) {
                $q->where('fim', '<', now());
            });
        } else {
            $query->whereHas('oferta', function ($q) {
                $q->where('fim', '>=', now());
            });
        }

        return Inertia::render('Usuario/Viagem/Listar', [
            'compras' => $query->get(),
            'view' => $view,
        ]);
    }

    public function usuarioViagemListarId(string $usuario, string $id): Response
    {
        $compra = Compra::with(['oferta.pacote.fotosDoPacote.fotos', 'oferta.pacote.hotel.cidade.estado', 'oferta.transporte', 'oferta.pacote.tags'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return Inertia::render('Usuario/Viagem/Detalhes', [
            'compra' => $compra,
        ]);
    }
}
