<?php

namespace App\Infrastructure\Persistence\Geografia;

use App\Domain\Geografia\Entities\Regiao;
use App\Domain\Geografia\Entities\Estado;
use App\Domain\Geografia\Entities\Cidade;
use App\Domain\Geografia\Repositories\LocalizacaoRepositoryInterface;
use Illuminate\Support\Facades\DB;

class LocalizacaoRepository implements LocalizacaoRepositoryInterface
{
    public function listarRegioes(): array
    {
        return DB::table('regiaos')->get()->map(fn($r) => new Regiao($r->id, $r->sigla, $r->nome))->all();
    }

    public function listarEstados(): array
    {
        return DB::table('estados')->get()->map(fn($r) => new Estado($r->id, $r->sigla, $r->nome, $r->regiao_id))->all();
    }

    public function listarCidades(): array
    {
        return DB::table('cidades')->get()->map(fn($r) => new Cidade($r->id, $r->nome, $r->estado_id))->all();
    }

    public function buscarRegiaoPorId(int $id): ?Regiao
    {
        $r = DB::table('regiaos')->where('id', $id)->first();
        return $r ? new Regiao($r->id, $r->sigla, $r->nome) : null;
    }

    public function buscarEstadoPorId(int $id): ?Estado
    {
        $r = DB::table('estados')->where('id', $id)->first();
        return $r ? new Estado($r->id, $r->sigla, $r->nome, $r->regiao_id) : null;
    }

    public function buscarCidadePorId(int $id): ?Cidade
    {
        $r = DB::table('cidades')->where('id', $id)->first();
        return $r ? new Cidade($r->id, $r->nome, $r->estado_id) : null;
    }

    public function contarCidades(): int
    {
        return DB::table('cidades')->count();
    }

    public function salvarRegiao(Regiao $regiao): void
    {
        DB::table('regiaos')->updateOrInsert(
            ['id' => $regiao->id],
            [
                'sigla' => $regiao->sigla,
                'nome' => $regiao->nome,
                'updated_at' => now(),
                'created_at' => DB::table('regiaos')->where('id', $regiao->id)->exists() ? DB::raw('created_at') : now(),
            ]
        );
    }

    public function salvarEstado(Estado $estado): void
    {
        DB::table('estados')->updateOrInsert(
            ['id' => $estado->id],
            [
                'sigla' => $estado->sigla,
                'nome' => $estado->nome,
                'regiao_id' => $estado->regiaoId,
                'updated_at' => now(),
                'created_at' => DB::table('estados')->where('id', $estado->id)->exists() ? DB::raw('created_at') : now(),
            ]
        );
    }

    public function salvarCidade(Cidade $cidade): void
    {
        DB::table('cidades')->updateOrInsert(
            ['id' => $cidade->id],
            [
                'nome' => $cidade->nome,
                'estado_id' => $cidade->estadoId,
                'updated_at' => now(),
                'created_at' => DB::table('cidades')->where('id', $cidade->id)->exists() ? DB::raw('created_at') : now(),
            ]
        );
    }

    public function listarAgrupado(): array
    {
        return DB::table('cidades')
            ->join('estados', 'cidades.estado_id', '=', 'estados.id')
            ->leftJoin('regiaos', 'estados.regiao_id', '=', 'regiaos.id')
            ->select(
                'cidades.id as cidade_id', 'cidades.nome as cidade_nome',
                'estados.id as estado_id', 'estados.nome as estado_nome', 'estados.sigla as estado_sigla',
                'regiaos.id as regiao_id', 'regiaos.nome as regiao_nome', 'regiaos.sigla as regiao_sigla',
            )
            ->get()
            ->all();
    }
}
