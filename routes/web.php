<?php

use App\Http\Controllers\Administracao\DashboardController;
use App\Http\Controllers\Administracao\HotelController;
use App\Http\Controllers\Administracao\OfertaController;
use App\Http\Controllers\Administracao\PacoteController;
use App\Http\Controllers\Administracao\PacoteFotoController;
use App\Http\Controllers\Administracao\TransporteController;
use App\Http\Controllers\Administracao\UsuarioController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\PasswordRecoveryController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\Usuario\PerfilController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Route;

Route::get('/', [RouteController::class, 'index'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('cadastro', [RegisteredUserController::class, 'create'])->name('cadastro');
    Route::post('cadastro', [RegisteredUserController::class, 'store']);

    Route::get('entrar', [AuthenticatedSessionController::class, 'create'])->name('entrar');
    Route::post('entrar', [AuthenticatedSessionController::class, 'store'])->name('login');
    Route::post('recuperar-senha', [PasswordRecoveryController::class, 'recover'])->name('password.recover');
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

Route::get('/buscar', [RouteController::class, 'buscar'])->name('buscar');
Route::get('/contato', [RouteController::class, 'contato'])->name('contato');

Route::middleware([Authenticate::class, EnsureEmailIsVerified::class, AdminMiddleware::class]) -> prefix(('administracao')) -> name('administracao.') ->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/estatisticas', [DashboardController::class, 'estatisticas'])->name('dashboard.estatisticas');
    Route::get('/hotel/listar', [HotelController::class, 'index'])->name('hotel.listar');
    Route::get('/hotel/registrar', [HotelController::class, 'create'])->name('hotel.registrar');
    Route::post('/hotel/registrar', [HotelController::class, 'store'])->name('hotel.store');
    Route::get('/hotel/editar/{hotel}', [HotelController::class, 'edit'])->name('hotel.edit');
    Route::put('/hotel/editar/{hotel}', [HotelController::class, 'update'])->name('hotel.update');
    Route::delete('/hotel/{hotel}', [HotelController::class, 'destroy'])->name('hotel.destroy');
    Route::get('/pacote/listar', [PacoteController::class, 'index'])->name('pacote.listar');
    Route::get('/pacote/registrar', [PacoteController::class, 'create'])->name('pacote.registrar');
    Route::post('/pacote/registrar', [PacoteController::class, 'store'])->name('pacote.store');
    Route::get('/pacote/editar/{pacote}', [PacoteController::class, 'edit'])->name('pacote.edit');
    Route::put('/pacote/editar/{pacote}', [PacoteController::class, 'update'])->name('pacote.update');
    Route::delete('/pacote/{pacote}', [PacoteController::class, 'destroy'])->name('pacote.destroy');
    Route::get('/pacotedefoto/listar', [PacoteFotoController::class, 'index'])->name('pacotedefoto.listar');
    Route::get('/pacotedefoto/registrar', [PacoteFotoController::class, 'create'])->name('pacotedefoto.registrar');
    Route::post('/pacotedefoto/registrar', [PacoteFotoController::class, 'store'])->name('pacotedefoto.store');
    Route::get('/pacotedefoto/editar/{pacotedefoto}', [PacoteFotoController::class, 'edit'])->name('pacotedefoto.edit');
    Route::post('/pacotedefoto/editar/{pacotedefoto}', [PacoteFotoController::class, 'update'])->name('pacotedefoto.update');
    Route::delete('/pacotedefoto/{pacotedefoto}', [PacoteFotoController::class, 'destroy'])->name('pacotedefoto.destroy');

    Route::get('/oferta/listar', [OfertaController::class, 'index'])->name('oferta.listar');
    Route::get('/oferta/registrar', [OfertaController::class, 'create'])->name('oferta.registrar');
    Route::post('/oferta/registrar', [OfertaController::class, 'store'])->name('oferta.store');
    Route::get('/oferta/editar/{oferta}', [OfertaController::class, 'edit'])->name('oferta.edit');
    Route::put('/oferta/editar/{oferta}', [OfertaController::class, 'update'])->name('oferta.update');
    Route::delete('/oferta/{oferta}', [OfertaController::class, 'destroy'])->name('oferta.destroy');
    Route::get('/transporte/listar', [TransporteController::class, 'index'])->name('transporte.listar');
    Route::get('/transporte/registrar', [TransporteController::class, 'create'])->name('transporte.registrar');
    Route::post('/transporte/registrar', [TransporteController::class, 'store'])->name('transporte.store');
    Route::get('/transporte/editar/{transporte}', [TransporteController::class, 'edit'])->name('transporte.edit');
    Route::put('/transporte/editar/{transporte}', [TransporteController::class, 'update'])->name('transporte.update');
    Route::delete('/transporte/{transporte}', [TransporteController::class, 'destroy'])->name('transporte.destroy');
    Route::get('/usuario/listar', [UsuarioController::class, 'index'])->name('usuario.listar');
    Route::get('/usuario/{user}', [UsuarioController::class, 'show'])->name('usuario.show');
    Route::post('/usuario/{user}/aprovar', [UsuarioController::class, 'aprovar'])->name('usuario.aprovar');
    Route::post('/usuario/{user}/block', [UsuarioController::class, 'toggleBlock'])->name('usuario.toggle-block');
    Route::put('/usuario/{user}/access', [UsuarioController::class, 'updateAccess'])->name('usuario.update-access');
    Route::put('/usuario/{user}/perfil', [PerfilController::class, 'adminUpdate'])->name('usuario.perfil-update');
    Route::get('/usuario/{user}/compras', [UsuarioController::class, 'compras'])->name('usuario.compras');
});

Route::prefix('checkout')->name('checkout.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/processar', [CheckoutController::class, 'processar'])->name('processar');
    Route::get('/confirmacao/{compraId}', [CheckoutController::class, 'confirmacao'])->name('confirmacao');
});

Route::get('/pacote/{nome}', [RouteController::class, 'pacote'])->name('pacote.detalhes');

Route::prefix('usuario/{user}/viagens')->name('usuario.viagem.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [RouteController::class, 'usuarioViagemListar'])->name('listar');
    Route::get('/detalhes/{compra}', [RouteController::class, 'usuarioViagemListarId'])->name('detalhes');
});

Route::prefix('usuario/perfil')->name('usuario.perfil.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [PerfilController::class, 'edit'])->name('edit');
    Route::put('/', [PerfilController::class, 'update'])->name('update');
    Route::put('/senha', [PerfilController::class, 'updatePassword'])->name('password');
});
