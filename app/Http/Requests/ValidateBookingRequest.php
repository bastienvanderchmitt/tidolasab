<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ValidateBookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'deposit' => ['required', 'numeric', 'min:0'],
            'date' => ['required', 'date_format:Y-m-d'],
            'type' => ['required', Rule::enum(PaymentMethod::class)],
            // Échéance du paiement attendu (versement de la plateforme), sinon celle par défaut
            'dueDate' => ['nullable', 'date_format:Y-m-d'],
        ];
    }
}
