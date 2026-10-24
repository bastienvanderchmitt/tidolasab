<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ConfirmPaymentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'deposit' => ['nullable', 'numeric', 'gt:0'],
            'date' => ['required', 'date_format:Y-m-d'],
            'type' => ['required', Rule::enum(PaymentMethod::class)],
        ];
    }
}
