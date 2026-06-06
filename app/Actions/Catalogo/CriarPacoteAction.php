<?php

namespace App\Actions\Catalogo;

use App\Models\Catalogo\Pacote;
use App\Repositories\Catalogo\PacoteRepository;

class CriarPacoteAction
{
    public function __construct(private readonly PacoteRepository $repository) {}

    public function execute(array $dados): Pacote
    {
        $tagsString = $dados['tags'] ?? '';
        $tagIds = $this->repository->processarTags($tagsString);

        $pacote = Pacote::create([
            'nome' => $dados['nome'],
            'descricao' => $dados['descricao'],
            'funcionario_id' => $dados['funcionario_id'],
            'pacote_foto_id' => $dados['pacote_foto_id'] ?? null,
            'tag_ids' => $tagIds,
        ]);

        $pacote->tags()->sync($tagIds);

        return $pacote;
    }
}
