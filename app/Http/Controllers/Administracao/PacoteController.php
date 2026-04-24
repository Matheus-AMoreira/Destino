<?php

namespace App\Http\Controllers\Administracao;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Administracao\StorePacoteRequest;
use App\Http\Requests\Administracao\UpdatePacoteRequest;
use App\Models\Pacote;
use App\Models\PacoteFoto;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PacoteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/Pacote/Index', [
            'pacotes' => Pacote::with(['funcionario', 'fotos_do_pacote'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administracao/Pacote/Create', [
            'funcionarios' => User::whereIn('role', [UserRole::ADMINISTRADOR, UserRole::FUNCIONARIO])->get(),
            'pacoteFotos' => PacoteFoto::all(),
            'tags' => Tag::all(),
        ]);
    }

    public function store(StorePacoteRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $tagsString = $data['tags'] ?? '';
        unset($data['tags']);

        $tagIds = $this->syncTags($tagsString);
        $data['tag_ids'] = $tagIds;

        $pacote = Pacote::create($data);
        $pacote->tags()->sync($tagIds);

        return redirect()->route('administracao.pacote.listar')
            ->with('success', 'Pacote criado com sucesso!');
    }

    public function edit(Pacote $pacote): Response
    {
        $pacote->load('tags');
        $pacote->tags_string = $pacote->tags->pluck('nome')->implode(', ');

        return Inertia::render('Administracao/Pacote/Edit', [
            'pacote' => $pacote,
            'funcionarios' => User::whereIn('role', [UserRole::ADMINISTRADOR, UserRole::FUNCIONARIO])->get(),
            'pacoteFotos' => PacoteFoto::all(),
            'tags' => Tag::all(),
        ]);
    }

    public function update(UpdatePacoteRequest $request, Pacote $pacote): RedirectResponse
    {
        $data = $request->validated();
        $tagsString = $data['tags'] ?? '';
        unset($data['tags']);

        $tagIds = $this->syncTags($tagsString);
        $data['tag_ids'] = $tagIds;

        $pacote->update($data);
        $pacote->tags()->sync($tagIds);

        return redirect()->route('administracao.pacote.listar')
            ->with('success', 'Pacote atualizado com sucesso!');
    }

    private function syncTags(string $tagsString): array
    {
        $tags = array_filter(array_map('trim', explode(',', $tagsString)));
        $tagIds = [];

        foreach ($tags as $tagName) {
            $tag = Tag::firstOrCreate(['nome' => $tagName]);
            $tagIds[] = $tag->id;
        }

        return $tagIds;
    }

    public function destroy(Pacote $pacote): RedirectResponse
    {
        $pacote->delete();

        return redirect()->route('administracao.pacote.listar')
            ->with('success', 'Pacote excluído com sucesso!');
    }

    public function compras(Pacote $pacote): JsonResponse
    {
        $compras = \App\Models\Compra::query()
            ->with(['user', 'oferta.hotel.cidade'])
            ->whereHas('oferta', function ($q) use ($pacote) {
                $q->where('pacote_id', $pacote->id);
            })
            ->latest('data_compra')
            ->get();

        return response()->json($compras);
    }
}
