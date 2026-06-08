<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Catalogo\PublicHomeController;
use App\Http\Controllers\Catalogo\PublicoBuscaController;
use App\Http\Controllers\Catalogo\PublicoPacoteController;
use App\Http\Controllers\Comercial\AvaliacaoController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Webhook\MercadoPagoWebhookController;
use Illuminate\Auth\Middleware\Authenticate;

// Públicas
Route::get('/', [PublicHomeController::class, 'index'])->name('home');
Route::get('/contato', [PublicHomeController::class, 'contato'])->name('contato');
Route::get('/buscar', [PublicoBuscaController::class, 'buscar'])->name('buscar');
Route::get('/pacote/{nome}', [PublicoPacoteController::class, 'detalhes'])->name('pacote.detalhes');

// Webhook Mercado Pago
Route::post('/webhook/mercadopago', [MercadoPagoWebhookController::class, 'handle'])->name('webhook.mercadopago');

// API de Avaliações Públicas
Route::get('/api/pacotes/{pacoteId}/avaliacoes', [AvaliacaoController::class, 'show']);

// Auth Routes (Original Breeze)
Route::middleware('guest')->group(function () {
    Route::get('cadastro', [RegisteredUserController::class, 'create'])->name('cadastro');
    Route::post('cadastro', [RegisteredUserController::class, 'store']);

    Route::get('entrar', [AuthenticatedSessionController::class, 'create'])->name('entrar');
    Route::post('entrar', [AuthenticatedSessionController::class, 'store'])->name('login');

    Route::get('esqueci-senha', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('esqueci-senha', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('redefinir-senha/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('redefinir-senha', [NewPasswordController::class, 'store'])->name('password.update');
});

Route::middleware([Authenticate::class])->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
