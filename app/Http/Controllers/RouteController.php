<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Compra;
use App\Models\Pacote;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RouteController extends Controller
{
    public function index(Request $request): Response
    {
        $pacotes = Pacote::with(['fotos_do_pacote', 'tags', 'ofertas.hotel.cidade.estado'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Index', [
            'pacotes' => $pacotes->items(),
            'totalPaginas' => $pacotes->lastPage(),
            'paginaAtual' => $pacotes->currentPage() - 1,
        ]);
    }

    public function buscar(Request $request): Response
    {
        $termo = $request->get('termo', '');
        $precoMax = (int) $request->get('precoMax', 0);
        $size = (int) $request->get('size', 12);

        $query = Pacote::with(['fotos_do_pacote', 'tags', 'ofertas.hotel.cidade.estado']);

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                $q->where('nome', 'like', "%{$termo}%")
                    ->orWhere('descricao', 'like', "%{$termo}%");
            });
        }

        if ($precoMax > 0) {
            $query->whereHas('ofertas', function ($q) use ($precoMax) {
                $q->where('preco', '<=', $precoMax);
            });
        }

        $pacotes = $query->latest()->paginate($size);

        return Inertia::render('Buscar', [
            'pacotes' => $pacotes->items(),
            'filters' => [
                'termo' => $termo,
                'precoMax' => $precoMax,
                'page' => $pacotes->currentPage() - 1,
                'size' => $size,
            ],
            'paginacao' => [
                'page' => $pacotes->currentPage() - 1,
                'totalPages' => $pacotes->lastPage(),
                'totalElements' => $pacotes->total(),
            ],
        ]);
    }

    public function contato(): Response
    {
        return Inertia::render('Contato');
    }

    public function administracao(): Response|RedirectResponse
    {
        return Inertia::render('Administracao/Dashboard');
    }

    public function administracaoDashboard(): Response
    {
        return Inertia::render('Administracao/Dashboard');
    }

    public function administracaoUsuarioListar(): Response
    {
        return Inertia::render('Administracao/Usuarios', [
            'usuarios' => User::all(),
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
        $pacote = Pacote::where('nome', $nome)->with([
            'fotos_do_pacote.fotos',
            'tags',
            'ofertas' => function ($query) {
                $query->where('is_available', true)
                    ->with(['hotel.cidade.estado', 'transporte']);
            },
        ])->firstOrFail();

        return Inertia::render('Pacote/Detalhes', [
            'pacote' => $pacote,
        ]);
    }

    public function usuarioViagemListar(Request $request, string $user_slug): Response
    {
        $user = User::whereRaw("REPLACE(CONCAT(nome, ' ', sobre_nome), ' ', '_') = ?", [$user_slug])->firstOrFail();
        $view = $request->query('view', 'andamento');
        $auth = auth()->user();

        // Authorization logic
        if ($auth->id !== $user->id) {
            if ($auth->role === UserRole::USUARIO) {
                abort(403, 'Acesso negado.');
            }
            if ($auth->role === UserRole::FUNCIONARIO && $user->role !== UserRole::USUARIO) {
                abort(403, 'Funcionários só podem visualizar histórico de usuários comuns.');
            }
        }

        $query = Compra::query()
            ->with(['oferta.pacote.fotos_do_pacote.fotos', 'oferta.hotel.cidade.estado', 'oferta.transporte', 'oferta.pacote.tags'])
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

        $compras = $query->latest('data_compra')->get();

        return Inertia::render('Usuario/Viagem/Listar', [
            'compras' => $compras,
            'view' => $view,
            'targetUser' => $user->only(['id', 'nome', 'email']),
        ]);
    }

    public function usuarioViagemListarId(string $user_slug, Compra $compra): Response
    {
        $user = User::whereRaw("REPLACE(CONCAT(nome, ' ', sobre_nome), ' ', '_') = ?", [$user_slug])->firstOrFail();
        $auth = auth()->user();

        // Authorization logic
        if ($auth->id !== $user->id) {
            if ($auth->role === UserRole::USUARIO) {
                abort(403, 'Acesso negado.');
            }
            if ($auth->role === UserRole::FUNCIONARIO && $user->role !== UserRole::USUARIO) {
                abort(403, 'Funcionários só podem visualizar detalhes de viagens de usuários comuns.');
            }
        }

        // Security check: ensure the purchase belongs to the user
        if ($compra->user_id !== $user->id) {
            abort(404);
        }

        $compra->load(['oferta.pacote.fotos_do_pacote.fotos', 'oferta.hotel.cidade.estado', 'oferta.transporte', 'oferta.pacote.tags']);

        return Inertia::render('Usuario/Viagem/Detalhes', [
            'compra' => $compra,
        ]);
    }
}
