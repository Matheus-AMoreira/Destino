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
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\Usuario\PerfilController;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Route;

Route::get('/', [RouteController::class, 'index'])->name('home');

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

Route::get('/buscar', [RouteController::class, 'buscar'])->name('buscar');
Route::get('/contato', [RouteController::class, 'contato'])->name('contato');

Route::middleware([Authenticate::class, EnsureEmailIsVerified::class])->prefix('administracao')->name('administracao.')->group(function () {
    // Dashboard (Acesso básico para quem pode ver algo na admin)
    Route::middleware('authorize.ui:dashboard:read')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard/estatisticas', [DashboardController::class, 'estatisticas'])->name('dashboard.estatisticas');
    });

    // Hotéis
    Route::middleware('authorize.ui:hotel:read')->group(function () {
        Route::get('/hotel/listar', [HotelController::class, 'index'])->name('hotel.listar');
        Route::get('/hotel/editar/{hotel}', [HotelController::class, 'edit'])->name('hotel.edit');
    });
    Route::middleware('authorize.api:hotel,create')->post('/hotel/registrar', [HotelController::class, 'store'])->name('hotel.store');
    Route::middleware('authorize.api:hotel,update')->put('/hotel/editar/{hotel}', [HotelController::class, 'update'])->name('hotel.update');
    Route::middleware('authorize.api:hotel,delete')->delete('/hotel/{hotel}', [HotelController::class, 'destroy'])->name('hotel.destroy');
    Route::get('/hotel/registrar', [HotelController::class, 'create'])->name('hotel.registrar')->middleware('authorize.ui:hotel:create');

    // Pacotes
    Route::middleware('authorize.ui:package:read')->group(function () {
        Route::get('/pacote/listar', [PacoteController::class, 'index'])->name('pacote.listar');
        Route::get('/pacote/editar/{pacote}', [PacoteController::class, 'edit'])->name('pacote.edit');
        Route::get('/pacote/{pacote}/compras', [PacoteController::class, 'compras'])->name('pacote.compras');
    });
    Route::middleware('authorize.api:package,create')->post('/pacote/registrar', [PacoteController::class, 'store'])->name('pacote.store');
    Route::middleware('authorize.api:package,update')->put('/pacote/editar/{pacote}', [PacoteController::class, 'update'])->name('pacote.update');
    Route::middleware('authorize.api:package,delete')->delete('/pacote/{pacote}', [PacoteController::class, 'destroy'])->name('pacote.destroy');
    Route::get('/pacote/registrar', [PacoteController::class, 'create'])->name('pacote.registrar')->middleware('authorize.ui:package:create');

    // Pacotes de Fotos
    Route::middleware('authorize.ui:package-photo:read')->group(function () {
        Route::get('/pacotedefoto/listar', [PacoteFotoController::class, 'index'])->name('pacotedefoto.listar');
        Route::get('/pacotedefoto/editar/{pacotedefoto}', [PacoteFotoController::class, 'edit'])->name('pacotedefoto.edit');
    });
    Route::middleware('authorize.api:package-photo,create')->post('/pacotedefoto/registrar', [PacoteFotoController::class, 'store'])->name('pacotedefoto.store');
    Route::middleware('authorize.api:package-photo,update')->post('/pacotedefoto/editar/{pacotedefoto}', [PacoteFotoController::class, 'update'])->name('pacotedefoto.update');
    Route::middleware('authorize.api:package-photo,delete')->delete('/pacotedefoto/{pacotedefoto}', [PacoteFotoController::class, 'destroy'])->name('pacotedefoto.destroy');
    Route::get('/pacotedefoto/registrar', [PacoteFotoController::class, 'create'])->name('pacotedefoto.registrar')->middleware('authorize.ui:package-photo:create');

    // Usuários (Gestão)
    Route::get('/usuario/registrar', [UsuarioController::class, 'create'])->name('usuario.registrar')->middleware('authorize.ui:user:create');
    Route::post('/usuario/registrar', [UsuarioController::class, 'store'])->name('usuario.store')->middleware('authorize.api:user,create');

    Route::middleware('authorize.ui:user:read')->group(function () {
        Route::get('/usuario/listar', [UsuarioController::class, 'index'])->name('usuario.listar');
        Route::get('/usuario/{user}', [UsuarioController::class, 'show'])->name('usuario.show');
        Route::get('/usuario/{user}/compras', [UsuarioController::class, 'compras'])->name('usuario.compras');
    });
    
    Route::post('/usuario/{user}/resend-invitation', [UsuarioController::class, 'resendInvitation'])->name('usuario.resend-invitation')->middleware('authorize.api:user,update');
    
    Route::middleware('authorize.api:user,update')->group(function () {
        Route::post('/usuario/{user}/aprovar', [UsuarioController::class, 'aprovar'])->name('usuario.aprovar');
        Route::post('/usuario/{user}/block', [UsuarioController::class, 'toggleBlock'])->name('usuario.toggle-block');
        Route::delete('/usuario/{user}', [UsuarioController::class, 'destroy'])->name('usuario.destroy');
        Route::put('/usuario/{user}/access', [UsuarioController::class, 'updateAccess'])->name('usuario.update-access');
        Route::put('/usuario/{user}/perfil', [PerfilController::class, 'adminUpdate'])->name('usuario.perfil-update');
    });

    // Ofertas
    Route::middleware('authorize.ui:offer:read')->group(function () {
        Route::get('/oferta/listar', [OfertaController::class, 'index'])->name('oferta.listar');
        Route::get('/oferta/editar/{oferta}', [OfertaController::class, 'edit'])->name('oferta.edit');
    });
    Route::middleware('authorize.api:offer,create')->post('/oferta/registrar', [OfertaController::class, 'store'])->name('offer.store');
    Route::middleware('authorize.api:offer,update')->put('/oferta/editar/{oferta}', [OfertaController::class, 'update'])->name('offer.update');
    Route::middleware('authorize.api:offer,delete')->delete('/oferta/{oferta}', [OfertaController::class, 'destroy'])->name('offer.destroy');
    Route::get('/oferta/registrar', [OfertaController::class, 'create'])->name('oferta.registrar')->middleware('authorize.ui:offer:create');

    // Transportes
    Route::middleware('authorize.ui:transport:read')->group(function () {
        Route::get('/transporte/listar', [TransporteController::class, 'index'])->name('transporte.listar');
        Route::get('/transporte/editar/{transporte}', [TransporteController::class, 'edit'])->name('transporte.edit');
    });
    Route::middleware('authorize.api:transport,create')->post('/transporte/registrar', [TransporteController::class, 'store'])->name('transport.store');
    Route::middleware('authorize.api:transport,update')->put('/transporte/editar/{transporte}', [TransporteController::class, 'update'])->name('transport.update');
    Route::middleware('authorize.api:transport,delete')->delete('/transporte/{transporte}', [TransporteController::class, 'destroy'])->name('transport.destroy');
    Route::get('/transporte/registrar', [TransporteController::class, 'create'])->name('transporte.registrar')->middleware('authorize.ui:transport:create');
});

Route::prefix('checkout')->name('checkout.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index')->middleware('authorize.ui:purchase:create');
    Route::post('/processar', [CheckoutController::class, 'processar'])->name('processar')->middleware('authorize.api:purchase,create');
    Route::get('/confirmacao/{compraId}', [CheckoutController::class, 'confirmacao'])->name('confirmacao')->middleware('authorize.ui:purchase:read');
});

Route::get('/pacote/{nome}', [RouteController::class, 'pacote'])->name('pacote.detalhes');

Route::prefix('{user:slug}/viagens')->name('usuario.viagem.')->middleware(['auth', 'verified', 'authorize.ui:purchase:read'])->group(function () {
    Route::get('/', [RouteController::class, 'usuarioViagemListar'])->name('listar');
    Route::get('/detalhes/{compra}', [RouteController::class, 'usuarioViagemListarId'])->name('detalhes');
});

Route::get('{user:slug}/perfil', [PerfilController::class, 'edit'])->name('usuario.perfil.edit')->middleware(['auth', 'verified', 'authorize.ui:profile:update']);
Route::put('{user:slug}/perfil', [PerfilController::class, 'update'])->name('usuario.perfil.update')->middleware(['auth', 'verified', 'authorize.api:profile,update']);
Route::put('{user:slug}/perfil/senha', [PerfilController::class, 'updatePassword'])->name('usuario.perfil.password')->middleware(['auth', 'verified', 'authorize.api:profile,update']);
Route::delete('{user:slug}/perfil', [PerfilController::class, 'destroy'])->name('usuario.perfil.destroy')->middleware(['auth', 'verified', 'authorize.api:profile,delete']);
