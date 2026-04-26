<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Adiciona coluna nullable para preenchimento em seguida
        Schema::table('users', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('sobre_nome');
        });

        // 2. Gera slugs únicos para todos os usuários existentes
        $existingSlugs = [];

        User::withoutGlobalScopes()->get(['id', 'nome', 'sobre_nome'])->each(function (User $user) use (&$existingSlugs) {
            $base = Str::slug("{$user->nome} {$user->sobre_nome}");
            $slug = $base;
            $counter = 2;

            while (in_array($slug, $existingSlugs)) {
                $slug = "{$base}-{$counter}";
                $counter++;
            }

            $existingSlugs[] = $slug;

            // Atualiza diretamente para evitar disparar hooks do modelo
            \Illuminate\Support\Facades\DB::table('users')
                ->where('id', $user->id)
                ->update(['slug' => $slug]);
        });

        // 3. Torna a coluna NOT NULL e única
        Schema::table('users', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
