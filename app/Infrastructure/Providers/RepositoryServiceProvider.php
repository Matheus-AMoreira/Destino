<?php

namespace App\Infrastructure\Providers;

use Illuminate\Support\ServiceProvider;

use App\Domain\Catalogo\Repositories\PacoteRepositoryInterface;
use App\Domain\Comercial\Repositories\OfertaRepositoryInterface;
use App\Domain\Comercial\Repositories\CompraRepositoryInterface;
use App\Domain\Identidade\Repositories\UsuarioRepositoryInterface;
use App\Domain\Hospedagem\Repositories\HotelRepositoryInterface;
use App\Domain\Hospedagem\Repositories\TransporteRepositoryInterface;
use App\Domain\Geografia\Repositories\LocalizacaoRepositoryInterface;

use App\Infrastructure\Persistence\Catalogo\PacoteRepository;
use App\Infrastructure\Persistence\Comercial\OfertaRepository;
use App\Infrastructure\Persistence\Comercial\CompraRepository;
use App\Infrastructure\Persistence\Identidade\UsuarioRepository;
use App\Infrastructure\Persistence\Hospedagem\HotelRepository;
use App\Infrastructure\Persistence\Hospedagem\TransporteRepository;
use App\Infrastructure\Persistence\Geografia\LocalizacaoRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PacoteRepositoryInterface::class, PacoteRepository::class);
        $this->app->bind(OfertaRepositoryInterface::class, OfertaRepository::class);
        $this->app->bind(CompraRepositoryInterface::class, CompraRepository::class);
        $this->app->bind(UsuarioRepositoryInterface::class, UsuarioRepository::class);
        $this->app->bind(HotelRepositoryInterface::class, HotelRepository::class);
        $this->app->bind(TransporteRepositoryInterface::class, TransporteRepository::class);
        $this->app->bind(LocalizacaoRepositoryInterface::class, LocalizacaoRepository::class);
    }
}
