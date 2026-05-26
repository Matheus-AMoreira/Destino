<?php

namespace App\Infrastructure\Persistence\Hospedagem;

use App\Domain\Hospedagem\Entities\Hotel;
use App\Domain\Hospedagem\Repositories\HotelRepositoryInterface;
use Illuminate\Support\Facades\DB;

class HotelRepository implements HotelRepositoryInterface
{
    public function buscarPorId(int $id): ?Hotel
    {
        $row = DB::table('hotels')->where('id', $id)->first();
        return $row ? $this->hydrate($row) : null;
    }

    public function buscarComLocalizacao(int $id): ?object
    {
        return DB::table('hotels')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('regiaos', 'estados.regiao_id', '=', 'regiaos.id')
            ->select(
                'hotels.*',
                'cidades.nome as cidade_nome',
                'estados.id as estado_id', 'estados.nome as estado_nome', 'estados.sigla as estado_sigla',
                'regiaos.id as regiao_id', 'regiaos.nome as regiao_nome',
            )
            ->where('hotels.id', $id)
            ->first();
    }

    public function listarComLocalizacao(): array
    {
        return DB::table('hotels')
            ->leftJoin('cidades', 'hotels.cidade_id', '=', 'cidades.id')
            ->leftJoin('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('regiaos', 'estados.regiao_id', '=', 'regiaos.id')
            ->select(
                'hotels.*',
                'cidades.nome as cidade_nome',
                'estados.id as estado_id', 'estados.nome as estado_nome', 'estados.sigla as estado_sigla',
                'regiaos.id as regiao_id', 'regiaos.nome as regiao_nome',
            )
            ->get()->all();
    }

    public function criar(array $dados): int
    {
        return DB::table('hotels')->insertGetId([
            'nome' => $dados['nome'],
            'endereco' => $dados['endereco'],
            'diaria' => $dados['diaria'],
            'cidade_id' => $dados['cidade_id'],
            'cep' => $dados['cep'] ?? null,
            'cep_data' => isset($dados['cep_data']) ? json_encode($dados['cep_data']) : null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function atualizar(int $id, array $dados): bool
    {
        $dados['updated_at'] = now();
        if (isset($dados['cep_data']) && is_array($dados['cep_data'])) {
            $dados['cep_data'] = json_encode($dados['cep_data']);
        }
        return DB::table('hotels')->where('id', $id)->update($dados) > 0;
    }

    public function deletar(int $id): bool
    {
        return DB::table('hotels')->where('id', $id)->delete() > 0;
    }

    public function contar(): int
    {
        return DB::table('hotels')->count();
    }

    private function hydrate(object $row): Hotel
    {
        return new Hotel(
            id: $row->id, nome: $row->nome, endereco: $row->endereco,
            diaria: $row->diaria, cidadeId: $row->cidade_id,
            createdAt: $row->created_at, updatedAt: $row->updated_at,
            cep: $row->cep ?? null,
            cepData: $row->cep_data ?? null,
        );
    }
}
