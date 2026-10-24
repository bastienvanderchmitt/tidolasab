<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Règle métier non respectée : le message est affiché tel quel à l'utilisateur.
 * Ces erreurs sont attendues et ne sont pas remontées à Sentry.
 */
class BusinessException extends Exception
{
    public function __construct(string $message, private readonly int $status = 422)
    {
        parent::__construct($message);
    }

    public function render(): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], $this->status);
    }
}
