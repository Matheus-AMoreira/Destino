<?php

namespace App\Infrastructure\Persistence\Shared;

use App\Domain\Shared\Repositories\ActivityLogRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ActivityLogRepository implements ActivityLogRepositoryInterface
{
    public function registrar(
        string $event,
        string $subjectType,
        string|int $subjectId,
        array $changes = [],
        ?string $causerId = null
    ): void {
        $causerId = $causerId ?? auth()->id();

        DB::table('activity_log')->insert([
            'log_name' => 'default',
            'description' => $event,
            'subject_type' => $subjectType,
            'subject_id' => (string) $subjectId,
            'event' => $event,
            'causer_type' => $causerId ? 'App\\Models\\User' : null,
            'causer_id' => $causerId,
            'attribute_changes' => !empty($changes) ? json_encode($changes) : null,
            'properties' => !empty($changes) ? json_encode($changes) : null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function listarRecentes(int $limit = 5): array
    {
        return DB::table('activity_log')
            ->leftJoin('users', function ($join) {
                $join->on(DB::raw('activity_log.causer_id::uuid'), '=', 'users.id');
            })
            ->select(
                'activity_log.id',
                'activity_log.description',
                'activity_log.created_at',
                'users.nome as causer_nome',
                'users.sobre_nome as causer_sobrenome'
            )
            ->orderByDesc('activity_log.created_at')
            ->limit($limit)
            ->get()
            ->all();
    }
}
