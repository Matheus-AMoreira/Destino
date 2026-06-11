<?php

namespace App\Http\Controllers\Comercial;

use App\Models\Comercial\Compra;
use App\Models\Comercial\Avaliacao;
use App\Repositories\Comercial\CompraRepository;
use App\Repositories\Comercial\AvaliacaoRepository;
use App\Actions\Comercial\SalvarAvaliacaoAction;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class ViagemController extends Controller
{
    public function __construct(
        private readonly CompraRepository $compraRepository,
        private readonly AvaliacaoRepository $avaliacaoRepository,
        private readonly SalvarAvaliacaoAction $salvarAction,
    ) {}

    public function index(Request $request): Response
    {
        $view = $request->input('view', 'andamento');
        $userId = $request->user()->id;
        
        $comprasRaw = Compra::with([
            'oferta.pacote.album',
            'oferta.hotel.cidade.estado',
            'oferta.transporte',
        ])
        ->where('user_id', $userId)
        ->whereHas('oferta', function ($q) use ($view) {
            if ($view === 'concluidas') {
                $q->where('fim', '<', now());
            } else {
                $q->where('fim', '>=', now());
            }
        })
        ->latest('data_compra')
        ->get();

        $compras = $comprasRaw->map(function (Compra $c) {
            $oferta = $c->oferta;
            $pacote = $oferta?->pacote;
            $hotel = $oferta?->hotel;
            $cidade = $hotel?->cidade;
            $estado = $cidade?->estado;
            $foto = $pacote?->album;

            $fotoCapaUrl = null;
            if ($foto && $foto->foto_capa) {
                $fotoCapaUrl = $foto->is_url ? $foto->foto_capa : Storage::url($foto->foto_capa);
            }

            $avaliacao = Avaliacao::where('compra_id', $c->id)->first();

            return [
                'id' => $c->id,
                'data_compra' => $c->data_compra?->toIso8601String(),
                'status' => $c->status,
                'metodo' => $c->metodo,
                'processador_pagamento' => $c->processador_pagamento,
                'parcelas' => $c->parcelas,
                'valor_final' => (float) $c->valor_final,
                'oferta' => $oferta ? [
                    'id' => $oferta->id,
                    'preco' => (float) $oferta->preco,
                    'inicio' => $oferta->inicio,
                    'fim' => $oferta->fim,
                    'disponibilidade' => $oferta->disponibilidade,
                    'status' => $oferta->status,
                    'isAvailable' => $oferta->disponibilidade > 0,
                    'hotel' => $hotel ? [
                        'id' => $hotel->id,
                        'nome' => $hotel->nome,
                        'cidade' => [
                            'nome' => $cidade ? $cidade->nome : '',
                            'estado' => ['sigla' => $estado ? $estado->sigla : ''],
                        ],
                    ] : null,
                    'transporte' => $oferta->transporte ? [
                        'id' => $oferta->transporte->id,
                        'empresa' => $oferta->transporte->empresa,
                        'meio' => $oferta->transporte->meio,
                    ] : null,
                    'pacote' => $pacote ? [
                        'id' => $pacote->id,
                        'nome' => $pacote->nome,
                        'descricao' => $pacote->descricao,
                        'fotos_do_pacote' => [
                            'foto_capa_url' => $fotoCapaUrl,
                            'fotos' => [],
                        ],
                    ] : null,
                ] : null,
                'avaliacao' => $avaliacao ? [
                    'id' => $avaliacao->id,
                    'nota' => $avaliacao->nota,
                ] : null,
            ];
        })
        ->toArray();

        return Inertia::render('Usuario/Viagem/Listar', [
            'compras' => $compras,
            'view' => $view,
        ]);
    }

    public function show(Request $request, string $id): Response|RedirectResponse
    {
        $userId = $request->user()->id;
        $c = $this->compraRepository->buscarPorIdParaUsuario($id, $userId);

        if (!$c) {
            return redirect()->route('usuario.viagem.listar', ['usuario' => $request->user()->nome])
                             ->with('error', 'Viagem não encontrada.');
        }

        $oferta = $c->oferta;
        $pacote = $oferta?->pacote;
        $hotel = $oferta?->hotel;
        $cidade = $hotel?->cidade;
        $estado = $cidade?->estado;
        $foto = $pacote?->album;

        $fotoCapaUrl = null;
        if ($foto && $foto->foto_capa) {
            $fotoCapaUrl = $foto->is_url ? $foto->foto_capa : Storage::url($foto->foto_capa);
        }

        $tags = $pacote ? $pacote->tags->map(fn($t) => ['nome' => $t->nome])->toArray() : [];

        $avaliacao = Avaliacao::where('compra_id', $c->id)->first();
        $avaliacaoData = null;
        if ($avaliacao) {
            $avaliacaoData = [
                'id' => $avaliacao->id,
                'nota' => $avaliacao->nota,
            ];
        }

        $compraData = [
            'id' => $c->id,
            'valor_final' => (float) $c->valor_final,
            'status' => $c->status,
            'data_compra' => $c->data_compra?->toIso8601String(),
            'metodo' => $c->metodo,
            'processador_pagamento' => $c->processador_pagamento,
            'parcelas' => $c->parcelas,
            'oferta' => [
                'id' => $oferta->id,
                'inicio' => $oferta->inicio,
                'fim' => $oferta->fim,
                'transporte' => [
                    'meio' => $oferta->transporte->meio ?? 'Aéreo',
                    'empresa' => $oferta->transporte->empresa ?? 'Azul/Gol/LATAM',
                ],
                'hotel' => [
                    'nome' => $hotel->nome ?? '',
                    'cidade' => [
                        'nome' => $cidade->nome ?? '',
                        'estado' => ['sigla' => $estado->sigla ?? ''],
                    ],
                ],
                'pacote' => [
                    'id' => $pacote->id ?? 0,
                    'nome' => $pacote->nome ?? '',
                    'descricao' => $pacote->descricao ?? '',
                    'fotos_do_pacote' => [
                        'foto_capa_url' => $fotoCapaUrl,
                        'fotos' => [],
                    ],
                    'tags' => $tags,
                ],
            ],
            'avaliacao' => $avaliacaoData,
        ];

        return Inertia::render('Usuario/Viagem/Detalhes', [
            'compra' => $compraData,
        ]);
    }

    public function avaliar(Request $request, string $id): Response|RedirectResponse
    {
        $userId = $request->user()->id;
        $c = $this->compraRepository->buscarPorIdParaUsuario($id, $userId);

        if (!$c) {
            return redirect()->route('usuario.viagem.listar', ['usuario' => $request->user()->nome])
                             ->with('error', 'Viagem não encontrada.');
        }

        $oferta = $c->oferta;
        $pacote = $oferta?->pacote;
        $hotel = $oferta?->hotel;
        $cidade = $hotel?->cidade;
        $estado = $cidade?->estado;
        $foto = $pacote?->album;

        $fotoCapaUrl = null;
        if ($foto && $foto->foto_capa) {
            $fotoCapaUrl = $foto->is_url ? $foto->foto_capa : Storage::url($foto->foto_capa);
        }

        $tags = $pacote ? $pacote->tags->map(fn($t) => ['nome' => $t->nome])->toArray() : [];

        $compraData = [
            'id' => $c->id,
            'valor_final' => (float) $c->valor_final,
            'status' => $c->status,
            'data_compra' => $c->data_compra?->toIso8601String(),
            'metodo' => $c->metodo,
            'processador_pagamento' => $c->processador_pagamento,
            'parcelas' => $c->parcelas,
            'oferta' => [
                'id' => $oferta->id,
                'inicio' => $oferta->inicio,
                'fim' => $oferta->fim,
                'transporte' => [
                    'meio' => $oferta->transporte->meio ?? 'Aéreo',
                    'empresa' => $oferta->transporte->empresa ?? 'Azul/Gol/LATAM',
                ],
                'hotel' => [
                    'nome' => $hotel->nome ?? '',
                    'cidade' => [
                        'nome' => $cidade->nome ?? '',
                        'estado' => ['sigla' => $estado->sigla ?? ''],
                    ],
                ],
                'pacote' => [
                    'id' => $pacote->id ?? 0,
                    'nome' => $pacote->nome ?? '',
                    'descricao' => $pacote->descricao ?? '',
                    'fotos_do_pacote' => [
                        'foto_capa_url' => $fotoCapaUrl,
                        'fotos' => [],
                    ],
                    'tags' => $tags,
                ],
            ],
        ];
        // Validar se a viagem já terminou
        $fimViagem = Carbon::parse($oferta->fim)->endOfDay();
        if ($fimViagem->isFuture()) {
            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('error', 'Você só pode avaliar após o término da viagem.');
        }

        // Só pode ter uma avaliação por usuário por pacote
        $jaAvaliouPacote = Avaliacao::where('user_id', $userId)
            ->where('pacote_id', $oferta->pacote_id)
            ->where('compra_id', '!=', $id)
            ->exists();
        if ($jaAvaliouPacote) {
            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('error', 'Você já avaliou este pacote.');
        }

        $avaliacaoExistente = Avaliacao::where('compra_id', $id)->first();

        return Inertia::render('Usuario/Viagem/Avaliar', [
            'compra' => $compraData,
            'avaliacaoExistente' => $avaliacaoExistente,
        ]);
    }

    public function salvarAvaliacao(Request $request, string $id): RedirectResponse
    {
        $userId = $request->user()->id;
        $compra = $this->compraRepository->buscarPorIdParaUsuario($id, $userId);

        if (!$compra) {
            return redirect()->route('usuario.viagem.listar', ['usuario' => $request->user()->nome])
                             ->with('error', 'Viagem não encontrada.');
        }

        // Validar se a viagem já terminou
        $fimViagem = Carbon::parse($compra->oferta->fim)->endOfDay();
        if ($fimViagem->isFuture()) {
            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('error', 'Você só pode avaliar após o término da viagem.');
        }

        // Só pode ter uma avaliação por usuário por pacote
        $jaAvaliouPacote = Avaliacao::where('user_id', $userId)
            ->where('pacote_id', $compra->oferta->pacote_id)
            ->where('compra_id', '!=', $id)
            ->exists();
        if ($jaAvaliouPacote) {
            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('error', 'Você já avaliou este pacote.');
        }

        $request->validate([
            'nota' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $this->salvarAction->execute(
                $userId,
                $compra->id,
                $compra->oferta->pacote_id,
                (int) $request->input('nota'),
                $request->input('comentario')
            );

            return redirect()->route('usuario.viagem.detalhes', ['id' => $id])
                             ->with('success', 'Avaliação salva com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
