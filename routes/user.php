<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Comercial\CheckoutController;
use App\Http\Controllers\Identidade\PerfilController;
use App\Http\Controllers\Comercial\ViagemController;
use App\Http\Controllers\Comercial\AvaliacaoController;
use App\Http\Middleware\CheckUserStatus;

// Checkout e Área do Usuário (Requer Auth)
Route::middleware(['auth', 'verified', CheckUserStatus::class])->group(function () {
    // Callbacks do Mercado Pago
    Route::get('/checkout/sucesso', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/falha', [CheckoutController::class, 'failure'])->name('checkout.failure');
    Route::get('/checkout/pendente', [CheckoutController::class, 'pending'])->name('checkout.pending');

    Route::get('/checkout/{ofertaId}', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/{ofertaId}', [CheckoutController::class, 'process'])->name('checkout.process');
    
    // Perfil do Usuário
    Route::get('/perfil', [PerfilController::class, 'edit'])->name('user.profile.edit');
    Route::match(['put', 'patch'], '/perfil', [PerfilController::class, 'update'])->name('user.profile.update');
    Route::put('/perfil/senha', [PerfilController::class, 'updatePassword'])->name('user.profile.password');
    
    // Viagens do Usuário
    Route::get('/minhas-viagens/detalhes/{id}', [ViagemController::class, 'show'])->name('usuario.viagem.detalhes');
    Route::get('/minhas-viagens/detalhes/{id}/avaliar', [ViagemController::class, 'avaliar'])->name('usuario.viagem.avaliar');
    Route::post('/minhas-viagens/detalhes/{id}/avaliar', [ViagemController::class, 'salvarAvaliacao'])->name('usuario.viagem.salvar_avaliacao');
    Route::get('/minhas-viagens/{usuario?}', [ViagemController::class, 'index'])->name('usuario.viagem.listar');

    // API de Avaliações
    Route::prefix('api')->group(function () {
        Route::post('/avaliacoes', [AvaliacaoController::class, 'store']);
        Route::put('/avaliacoes/{id}', [AvaliacaoController::class, 'update']);
        Route::delete('/avaliacoes/{id}', [AvaliacaoController::class, 'destroy']);
        Route::get('/avaliacoes/permissao/{compraId}', [AvaliacaoController::class, 'verificarPermissao']);
    });
});
