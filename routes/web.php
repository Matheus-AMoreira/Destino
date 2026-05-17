<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Publico\HomeController;
use App\Http\Controllers\Publico\BuscaController;
use App\Http\Controllers\Publico\PacoteController as PublicoPacoteController;
use App\Http\Controllers\Usuario\CheckoutController;
use App\Http\Controllers\Usuario\PerfilController;
use App\Http\Controllers\Usuario\ViagemController;
use App\Http\Controllers\Administracao\DashboardController;
use App\Http\Controllers\Administracao\HotelController;
use App\Http\Controllers\Administracao\OfertaController;
use App\Http\Controllers\Administracao\PacoteController as AdminPacoteController;
use App\Http\Controllers\Administracao\PacoteFotoController;
use App\Http\Controllers\Administracao\TransporteController;
use App\Http\Controllers\Administracao\UsuarioController;
use App\Http\Middleware\CheckUserStatus;
use App\Http\Middleware\AdminMiddleware;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Auth\Middleware\Authenticate;

// Públicas
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/contato', [HomeController::class, 'contato'])->name('contato');
Route::get('/buscar', [BuscaController::class, 'buscar'])->name('buscar');
Route::get('/pacote/{nome}', [PublicoPacoteController::class, 'detalhes'])->name('pacote.detalhes');

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

// Checkout e Área do Usuário (Requer Auth)
Route::middleware(['auth', 'verified', CheckUserStatus::class])->group(function () {
    Route::get('/checkout/{ofertaId}', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/{ofertaId}', [CheckoutController::class, 'process'])->name('checkout.process');
    
    // Perfil do Usuário
    Route::get('/perfil', [PerfilController::class, 'edit'])->name('user.profile.edit');
    Route::patch('/perfil', [PerfilController::class, 'update'])->name('user.profile.update');
    Route::put('/perfil/senha', [PerfilController::class, 'updatePassword'])->name('user.profile.password');
    
    // Viagens do Usuário
    Route::get('/minhas-viagens/detalhes/{id}', [ViagemController::class, 'show'])->name('usuario.viagem.detalhes');
    Route::get('/minhas-viagens/{usuario?}', [ViagemController::class, 'index'])->name('usuario.viagem.listar');
});

// Admin
Route::middleware(['auth', 'verified', AdminMiddleware::class])->prefix('administracao')->name('administracao.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('authorize.ui:dashboard:read');
    Route::get('/dashboard/estatisticas', [DashboardController::class, 'estatisticas'])->name('dashboard.estatisticas')->middleware('authorize.ui:dashboard:read');

    // Hotéis
    Route::prefix('hotel')->name('hotel.')->group(function () {
        Route::get('/listar', [HotelController::class, 'index'])->name('index')->middleware('authorize.ui:hotel,read');
        Route::get('/novo', [HotelController::class, 'create'])->name('create')->middleware('authorize.ui:hotel,create');
        Route::post('/', [HotelController::class, 'store'])->name('store')->middleware('authorize.api:hotel,create');
        Route::get('/{id}/editar', [HotelController::class, 'edit'])->name('edit')->middleware('authorize.ui:hotel,update');
        Route::put('/{id}', [HotelController::class, 'update'])->name('update')->middleware('authorize.api:hotel,update');
        Route::delete('/{id}', [HotelController::class, 'destroy'])->name('destroy')->middleware('authorize.api:hotel,delete');
    });

    // Transportes
    Route::prefix('transporte')->name('transporte.')->group(function () {
        Route::get('/listar', [TransporteController::class, 'index'])->name('index')->middleware('authorize.ui:transport,read');
        Route::get('/novo', [TransporteController::class, 'create'])->name('create')->middleware('authorize.ui:transport,create');
        Route::post('/', [TransporteController::class, 'store'])->name('store')->middleware('authorize.api:transport,create');
        Route::get('/{id}/editar', [TransporteController::class, 'edit'])->name('edit')->middleware('authorize.ui:transport,update');
        Route::put('/{id}', [TransporteController::class, 'update'])->name('update')->middleware('authorize.api:transport,update');
        Route::delete('/{id}', [TransporteController::class, 'destroy'])->name('destroy')->middleware('authorize.api:transport,delete');
    });

    // Pacotes de Fotos
    Route::prefix('pacote-foto')->name('pacote-foto.')->group(function () {
        Route::get('/listar', [PacoteFotoController::class, 'index'])->name('index')->middleware('authorize.ui:package-photo,read');
        Route::get('/novo', [PacoteFotoController::class, 'create'])->name('create')->middleware('authorize.ui:package-photo,create');
        Route::post('/', [PacoteFotoController::class, 'store'])->name('store')->middleware('authorize.api:package-photo,create');
        Route::get('/{id}/editar', [PacoteFotoController::class, 'edit'])->name('edit')->middleware('authorize.ui:package-photo,update');
        Route::post('/{id}', [PacoteFotoController::class, 'update'])->name('update')->middleware('authorize.api:package-photo,update'); // POST com _method=PUT para file uploads
        Route::delete('/{id}', [PacoteFotoController::class, 'destroy'])->name('destroy')->middleware('authorize.api:package-photo,delete');
    });

    // Pacotes
    Route::prefix('pacote')->name('pacote.')->group(function () {
        Route::get('/listar', [AdminPacoteController::class, 'index'])->name('index')->middleware('authorize.ui:package,read');
        Route::get('/novo', [AdminPacoteController::class, 'create'])->name('create')->middleware('authorize.ui:package,create');
        Route::post('/', [AdminPacoteController::class, 'store'])->name('store')->middleware('authorize.api:package,create');
        Route::get('/{id}/editar', [AdminPacoteController::class, 'edit'])->name('edit')->middleware('authorize.ui:package,update');
        Route::put('/{id}', [AdminPacoteController::class, 'update'])->name('update')->middleware('authorize.api:package,update');
        Route::delete('/{id}', [AdminPacoteController::class, 'destroy'])->name('destroy')->middleware('authorize.api:package,delete');
        Route::get('/{pacote}/compras', [AdminPacoteController::class, 'compras'])->name('compras')->middleware('authorize.api:package,read');
    });

    // Ofertas
    Route::prefix('oferta')->name('oferta.')->group(function () {
        Route::get('/listar', [OfertaController::class, 'index'])->name('index')->middleware('authorize.ui:offer,read');
        Route::get('/novo', [OfertaController::class, 'create'])->name('create')->middleware('authorize.ui:offer,create');
        Route::post('/', [OfertaController::class, 'store'])->name('store')->middleware('authorize.api:offer,create');
        Route::get('/{id}/editar', [OfertaController::class, 'edit'])->name('edit')->middleware('authorize.ui:offer,update');
        Route::put('/{id}', [OfertaController::class, 'update'])->name('update')->middleware('authorize.api:offer,update');
        Route::delete('/{id}', [OfertaController::class, 'destroy'])->name('destroy')->middleware('authorize.api:offer,delete');
    });

    // Usuários
    Route::prefix('usuario')->name('usuario.')->group(function () {
        Route::get('/listar', [UsuarioController::class, 'index'])->name('index')->middleware('authorize.ui:user,read');
        Route::get('/novo', [UsuarioController::class, 'create'])->name('create')->middleware('authorize.ui:user,create');
        Route::post('/', [UsuarioController::class, 'store'])->name('store')->middleware('authorize.api:user,create');
        Route::get('/editar/{nome}/{id}', [UsuarioController::class, 'edit'])->name('edit')->middleware('authorize.ui:user,update');
        Route::put('/{id}', [UsuarioController::class, 'update'])->name('update')->middleware('authorize.api:user,update');
        Route::patch('/{id}/status', [UsuarioController::class, 'updateStatus'])->name('update-status')->middleware('authorize.api:user,update');
        Route::delete('/{id}', [UsuarioController::class, 'destroy'])->name('destroy')->middleware('authorize.api:user,delete');
    });
});
