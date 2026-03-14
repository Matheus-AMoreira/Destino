<?php

use App\Http\Controllers\RouteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [RouteController::class, 'index'])->name('home');
Route::get('/entrar', [RouteController::class, 'entrar'])->name('entrar');
Route::get('/cadastro', [RouteController::class, 'cadastro'])->name('cadastro');
Route::get('/buscar', [RouteController::class, 'buscar'])->name('buscar');
Route::get('/contato', [RouteController::class, 'contato'])->name('contato');

Route::prefix('administracao')->name('administracao.')->group(function () {
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

Route::prefix('checkout')->name('checkout.')->group(function () {
    Route::get('/', [RouteController::class, 'checkout'])->name('index');
    Route::get('/confirmacao/{compraId}', [RouteController::class, 'checkoutConfirmacao'])->name('confirmacao');
});

Route::get('/pacote/{nome}', [RouteController::class, 'pacote'])->name('pacote.detalhes');

Route::prefix('{usuario}/viagem/listar')->name('usuario.viagem.')->group(function () {
    Route::get('/', [RouteController::class, 'usuarioViagemListar'])->name('listar');
    Route::get('/{id}', [RouteController::class, 'usuarioViagemListarId'])->name('detalhes');
});
