<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SavePaymentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'booking' => ['required', 'integer', Rule::exists('reservations', 'id')],
            'deposit' => ['required', 'numeric'],
            'date' => ['required', 'date_format:Y-m-d'],
            'type' => ['required', Rule::enum(PaymentMethod::class)],
            'note' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
