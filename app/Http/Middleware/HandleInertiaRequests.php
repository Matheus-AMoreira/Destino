<?php

namespace App\Http\Middleware;

use App\Services\Identidade\AuthService;
use Illuminate\Http\Request;
use Inertia\Middleware;


class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $authDto = null;
        if ($request->user()) {
            $authDto = app(AuthService::class)->buildAuthDTO($request->user()->id);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authDto,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'invitation_password' => app()->isProduction() ? null : $request->session()->get('invitation_password'),
            ],
        ];
    }
}
