<?php

namespace App\Infrastructure\Persistence\Hospedagem;

use App\Domain\Hospedagem\Entities\Transporte;
use App\Domain\Hospedagem\Repositories\TransporteRepositoryInterface;
use App\Enums\Meio;
use Illuminate\Support\Facades\DB;

class TransporteRepository implements TransporteRepositoryInterface
{
    public function buscarPorId(int $id): ?Transporte
    {
        $row = DB::table('transportes')->where('id', $id)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function listarTodos(): array
    {
        return DB::table('transportes')->get()->map(fn($r) => $this->hydrate($r))->all();
    }

    public function criar(array $dados): int
    {
        return DB::table('transportes')->insertGetId([
            'empresa' => $dados['empresa'],
            'meio' => $dados['meio'] instanceof Meio ? $dados['meio']->value : $dados['meio'],
            'preco' => $dados['preco'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function atualizar(int $id, array $dados): bool
    {
        if (isset($dados['meio']) && $dados['meio'] instanceof Meio) {
            $dados['meio'] = $dados['meio']->value;
        }
        $dados['updated_at'] = now();
        return DB::table('transportes')->where('id', $id)->update($dados) > 0;
    }

    public function deletar(int $id): bool
    {
        return DB::table('transportes')->where('id', $id)->delete() > 0;
    }

    public function contar(): int
    {
        return DB::table('transportes')->count();
    }

    private function hydrate(object $row): Transporte
    {
        return new Transporte(
            id: $row->id, empresa: $row->empresa,
            meio: Meio::from($row->meio), preco: $row->preco,
            createdAt: $row->created_at, updatedAt: $row->updated_at,
        );
    }
}
