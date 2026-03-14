<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\Oferta;
use App\Models\Pacote;
use App\Models\Transporte;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administracao/Dashboard', [
            'stats' => [
                'hoteis' => Hotel::count(),
                'transportes' => Transporte::count(),
                'pacotes' => Pacote::count(),
                'ofertas' => Oferta::count(),
                'usuarios' => User::count(),
            ],
        ]);
    }
}
