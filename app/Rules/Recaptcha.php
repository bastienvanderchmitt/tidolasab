<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class Recaptcha implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $response = Http::asForm()->timeout(10)->post(config('services.recaptcha.verify_url'), [
            'secret' => config('services.recaptcha.secret'),
            'response' => $value,
        ]);

        if (! $response->json('success')) {
            $fail(__('errors.recaptcha'));
        }
    }
}
