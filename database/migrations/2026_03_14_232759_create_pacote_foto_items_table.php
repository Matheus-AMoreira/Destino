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
        Schema::create('pacote_foto_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pacote_foto_id')->constrained('pacote_fotos')->cascadeOnDelete();
            $table->string('caminho');
            $table->boolean('is_url')->default(false);
            $table->integer('ordem')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacote_foto_items');
    }
};
