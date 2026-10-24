<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Utilise la langue choisie sur le site (en-tête Accept-Language envoyé par le front).
 */
class SetLocaleFromRequest
{
    private const SUPPORTED = ['fr', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->getPreferredLanguage(self::SUPPORTED);
        app()->setLocale($locale ?? config('app.locale'));

        return $next($request);
    }
}
