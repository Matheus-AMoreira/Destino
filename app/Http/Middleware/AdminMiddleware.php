<?php

namespace App\Http\Middleware;

use App\Services\Identidade\AuthService;
use App\Enums\Identidade\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_valid) {
            abort(403, 'Acesso negado.');
        }

        $authDTO = $this->authService->buildAuthDTO($user->id);

        if (!$authDTO || !in_array($authDTO['role_name'], [UserRole::ADMINISTRADOR->value, UserRole::FUNCIONARIO->value])) {
            abort(403, 'Acesso negado.');
        }

        return $next($request);
    }
}
