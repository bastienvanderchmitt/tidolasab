<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Numéro français ou international : chiffres, espaces, points, tirets et
 * parenthèses, + en tête, entre 8 et 15 chiffres (resources/js/helpers/validation.js).
 */
class PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $value = trim((string) $value);
        $digits = strlen(preg_replace('/\D/', '', $value));

        if (! preg_match('/^\+?[0-9 ().-]+$/', $value) || $digits < 8 || $digits > 15) {
            $fail('validation.phone')->translate();
        }
    }
}
