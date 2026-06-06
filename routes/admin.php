<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Administracao\DashboardController;
use App\Http\Controllers\Hospedagem\AdminHotelController as HotelController;
use App\Http\Controllers\Comercial\AdminOfertaController as OfertaController;
use App\Http\Controllers\Catalogo\AdminPacoteController;
use App\Http\Controllers\Catalogo\AdminPacoteFotoController as PacoteFotoController;
use App\Http\Controllers\Hospedagem\AdminTransporteController as TransporteController;
use App\Http\Controllers\Identidade\AdminUsuarioController as UsuarioController;
use App\Http\Middleware\AdminMiddleware;

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
        Route::get('/listar', [UsuarioController::class, 'index'])->name('index')->middleware('authorize.ui:user-client,read');
        Route::get('/novo', [UsuarioController::class, 'create'])->name('create')->middleware('authorize.ui:user-staff,create');
        Route::post('/', [UsuarioController::class, 'store'])->name('store')->middleware('authorize.api:user-staff,create');
        Route::get('/editar/{nome}/{id}', [UsuarioController::class, 'edit'])->name('edit'); // Permissão verificada no controller (staff vs cliente)
        Route::put('/{id}', [UsuarioController::class, 'update'])->name('update'); // Permissão verificada no controller
        Route::patch('/{id}/status', [UsuarioController::class, 'updateStatus'])->name('update-status'); // Permissão verificada no controller
        Route::delete('/{id}', [UsuarioController::class, 'destroy'])->name('destroy')->middleware('authorize.api:user-client,delete');
    });
});
