<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pacote_fotos', function (Blueprint $table) {
            $table->boolean('is_url')->default(false)->after('foto_capa');
        });

        Schema::table('pacote_foto_items', function (Blueprint $table) {
            $table->boolean('is_url')->default(false)->after('caminho');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pacote_fotos', function (Blueprint $table) {
            $table->dropColumn('is_url');
        });

        Schema::table('pacote_foto_items', function (Blueprint $table) {
            $table->dropColumn('is_url');
        });
    }
};
