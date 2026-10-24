<?php

namespace App\Support;

/**
 * Montants des emails, à la française : « 171 », « 171,50 », « 1 250 ».
 */
final class Money
{
    public static function format(float|int|string|null $amount): string
    {
        $amount = round((float) $amount, 2);
        $decimals = floor($amount) == $amount ? 0 : 2;

        return number_format($amount, $decimals, ',', "\u{202F}");
    }
}
