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
            $table->string('storage_type')->default('local')->after('nome');
            $table->renameColumn('foto_do_pacote', 'foto_capa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pacote_fotos', function (Blueprint $table) {
            $table->dropColumn('storage_type');
            $table->renameColumn('foto_capa', 'foto_do_pacote');
        });
    }
};
