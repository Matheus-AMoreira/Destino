<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeAPI
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $resource, string $action): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasPermission("{$resource}:{$action}")) {
            return response()->json([
                'message' => "Ação '{$resource}:{$action}' não permitida para este papel."
            ], 403);
        }

        return $next($request);
    }
}
