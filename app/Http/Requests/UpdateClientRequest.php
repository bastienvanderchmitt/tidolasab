<?php

namespace App\Http\Requests;

use App\Rules\PhoneNumber;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'firstName' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email:rfc,strict', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20', new PhoneNumber],
            'address' => ['nullable', 'string', 'max:1000'],
            'note' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
