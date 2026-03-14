<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::get('/', [RouteController::class, 'index'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('cadastro', [RegisteredUserController::class, 'create'])->name('cadastro');
    Route::post('cadastro', [RegisteredUserController::class, 'store']);

    Route::get('entrar', [AuthenticatedSessionController::class, 'create'])->name('entrar');
    Route::post('entrar', [AuthenticatedSessionController::class, 'store'])->name('login');
});

Route::middleware('auth')->group(function () {
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

Route::get('/buscar', [RouteController::class, 'buscar'])->name('buscar');
Route::get('/contato', [RouteController::class, 'contato'])->name('contato');

Route::prefix('administracao')->name('administracao.')->middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/', [RouteController::class, 'administracao'])->name('index');
    Route::get('/dashboard', [RouteController::class, 'administracaoDashboard'])->name('dashboard');
    Route::get('/hotel/listar', [RouteController::class, 'administracaoHotelListar'])->name('hotel.listar');
    Route::get('/hotel/registrar', [RouteController::class, 'administracaoHotelRegistrar'])->name('hotel.registrar');
    Route::get('/pacote/listar', [RouteController::class, 'administracaoPacoteListar'])->name('pacote.listar');
    Route::get('/pacote/registrar', [RouteController::class, 'administracaoPacoteRegistrar'])->name('pacote.registrar');
    Route::get('/pacotedefoto/listar', [RouteController::class, 'administracaoPacotedefotoListar'])->name('pacotedefoto.listar');
    Route::get('/pacotedefoto/registrar', [RouteController::class, 'administracaoPacotedefotoRegistrar'])->name('pacotedefoto.registrar');
    Route::get('/transporte/listar', [RouteController::class, 'administracaoTransporteListar'])->name('transporte.listar');
    Route::get('/transporte/registrar', [RouteController::class, 'administracaoTransporteRegistrar'])->name('transporte.registrar');
    Route::get('/usuario/listar', [RouteController::class, 'administracaoUsuarioListar'])->name('usuario.listar');
});

Route::prefix('checkout')->name('checkout.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/processar', [CheckoutController::class, 'processar'])->name('processar');
    Route::get('/confirmacao/{compraId}', [CheckoutController::class, 'confirmacao'])->name('confirmacao');
});

Route::get('/pacote/{nome}', [RouteController::class, 'pacote'])->name('pacote.detalhes');

Route::prefix('{usuario}/viagem/listar')->name('usuario.viagem.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [RouteController::class, 'usuarioViagemListar'])->name('listar');
    Route::get('/{id}', [RouteController::class, 'usuarioViagemListarId'])->name('detalhes');
});
