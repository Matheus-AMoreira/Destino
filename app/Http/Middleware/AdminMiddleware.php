<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, [UserRole::ADMINISTRADOR, UserRole::FUNCIONARIO]) || ! $user->is_valid) {
            abort(403, 'Acesso negado.');
        }

        return $next($request);
    }
}
