<?php

namespace App\Actions\Catalogo;

use App\Models\Catalogo\Pacote;
use App\Repositories\Catalogo\PacoteRepository;

class AtualizarPacoteAction
{
    public function __construct(private readonly PacoteRepository $repository) {}

    public function execute(Pacote $pacote, array $dados): Pacote
    {
        $tagsString = $dados['tags'] ?? null;

        if (array_key_exists('nome', $dados)) $pacote->nome = $dados['nome'];
        if (array_key_exists('descricao', $dados)) $pacote->descricao = $dados['descricao'];
        if (array_key_exists('funcionario_id', $dados)) $pacote->funcionario_id = $dados['funcionario_id'];
        if (array_key_exists('pacote_foto_id', $dados)) $pacote->pacote_foto_id = $dados['pacote_foto_id'];

        if ($tagsString !== null) {
            $tagIds = $this->repository->processarTags($tagsString);
            $pacote->tag_ids = $tagIds;
            $pacote->tags()->sync($tagIds);
        }

        $pacote->save();

        return $pacote;
    }
}
