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
        Schema::create('pacote_fotos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('storage_type')->default('local');
            $table->text('foto_capa');
            $table->boolean('is_url')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacote_fotos');
    }
};
