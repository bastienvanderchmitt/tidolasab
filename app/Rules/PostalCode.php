<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Code postal à 5 chiffres pour la France, l'outre-mer et Monaco ;
 * format alphanumérique souple ailleurs (resources/js/helpers/validation.js).
 */
class PostalCode implements ValidationRule
{
    public const FIVE_DIGITS = ['FR', 'GP', 'MQ', 'GF', 'RE', 'YT', 'MC', 'BL', 'MF', 'PM'];

    public function __construct(private ?string $countryCode) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $value = trim((string) $value);
        $pattern = in_array(strtoupper((string) $this->countryCode), self::FIVE_DIGITS, true)
            ? '/^\d{5}$/'
            : '/^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/';

        if (! preg_match($pattern, $value)) {
            $fail('validation.postal_code')->translate();
        }
    }
}
