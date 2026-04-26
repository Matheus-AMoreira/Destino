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
        $pacotes = Pacote::has('ofertas')
            ->with([
                'fotos_do_pacote',
                'tags',
                'cheapestActiveOffer.hotel.cidade.estado',
                'latestOffer.hotel.cidade.estado'
            ])
            ->withCount(['ofertas as active_ofertas_count' => function ($query) {
                $query->where('is_available', true);
            }])
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
        $size = min((int) $request->get('size', 12), 50); // Limite máximo para prevenir DoS

        $query = Pacote::has('ofertas')
            ->with([
                'fotos_do_pacote',
                'tags',
                'cheapestActiveOffer.hotel.cidade.estado',
                'latestOffer.hotel.cidade.estado'
            ])
            ->withCount(['ofertas as active_ofertas_count' => function ($query) {
                $query->where('is_available', true);
            }]);

        if ($termo) {
            $query->where(function ($q) use ($termo) {
                $q->where('nome', 'like', "%{$termo}%")
                    ->orWhere('descricao', 'like', "%{$termo}%");
            });
        }

        if ($precoMax > 0) {
            $query->whereHas('ofertas', function ($q) use ($precoMax) {
                $q->where('preco', '<=', $precoMax)
                    ->where('is_available', true);
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

    public function pacote(string $nome): Response
    {
        $pacote = Pacote::where('nome', $nome)->with([
            'fotos_do_pacote.fotos',
            'tags',
            'ofertas' => function ($query) {
                $query->where('is_available', true)
                    ->with(['hotel.cidade.estado', 'transporte']);
            },
            'latestOffer.hotel.cidade.estado',
            'latestOffer.transporte',
        ])->firstOrFail();

        return Inertia::render('Pacote/Detalhes', [
            'pacote' => $pacote,
        ]);
    }

    public function usuarioViagemListar(Request $request, User $user): Response
    {
        $view = $request->query('view', 'andamento');
        $auth = auth()->user();

        // Authorization logic
        if ($auth->id !== $user->id) {
            if ($auth->role->name === UserRole::USUARIO->value) {
                abort(403, 'Acesso negado.');
            }
            if ($auth->role->name === UserRole::FUNCIONARIO->value && $user->role->name !== UserRole::USUARIO->value) {
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

    public function usuarioViagemListarId(User $user, Compra $compra): Response
    {
        $auth = auth()->user();

        // Authorization logic
        if ($auth->id !== $user->id) {
            if ($auth->role->name === UserRole::USUARIO->value) {
                abort(403, 'Acesso negado.');
            }
            if ($auth->role->name === UserRole::FUNCIONARIO->value && $user->role->name !== UserRole::USUARIO->value) {
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
