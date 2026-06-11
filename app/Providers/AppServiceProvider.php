<?php

namespace App\Providers;

use App\Models\Catalogo\Pacote;
use App\Models\Catalogo\PacoteFoto;
use App\Models\Comercial\Oferta;
use App\Models\Hospedagem\Hotel;
use App\Models\Hospedagem\Transporte;
use App\Models\Identidade\Usuario;
use App\Observers\Catalogo\PacoteFotoObserver;
use App\Observers\Catalogo\PacoteObserver;
use App\Observers\Comercial\OfertaObserver;
use App\Observers\Hospedagem\HotelObserver;
use App\Observers\Hospedagem\TransporteObserver;
use App\Observers\Identidade\UsuarioObserver;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Connection;
use Illuminate\Database\PostgresConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Connection::resolverFor('pgsql', function ($connection, $database, $prefix, $config) {
            return new class($connection, $database, $prefix, $config) extends PostgresConnection {
                public function prepareBindings(array $bindings)
                {
                    $grammar = $this->getQueryGrammar();

                    foreach ($bindings as $key => $value) {
                        if ($value instanceof DateTimeInterface) {
                            $bindings[$key] = $value->format($grammar->getDateFormat());
                        } elseif (is_bool($value)) {
                            $bindings[$key] = $value ? 'true' : 'false';
                        }
                    }

                    return $bindings;
                }
            };
        });
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production' | config('app.env') === 'ngrok') {
            URL::forceScheme('https');
        }else{
            $this->configureDefaults();
        }
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by(
                $request->input('email') . '|' . $request->ip()
            );
        });

        Pacote::observe(PacoteObserver::class);
        PacoteFoto::observe(PacoteFotoObserver::class);
        Oferta::observe(OfertaObserver::class);
        Hotel::observe(HotelObserver::class);
        Transporte::observe(TransporteObserver::class);
        Usuario::observe(UsuarioObserver::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
