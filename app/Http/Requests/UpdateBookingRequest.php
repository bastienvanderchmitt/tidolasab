<?php

namespace App\Http\Requests;

use App\Enums\BookingType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'checkIn' => ['required', 'date_format:Y-m-d'],
            'checkOut' => ['required', 'date_format:Y-m-d', 'after:checkIn'],
            'adults' => ['required', 'integer', 'min:0', 'max:20'],
            'children' => ['nullable', 'integer', 'min:0', 'max:20'],
            'type' => ['required', Rule::enum(BookingType::class)],
            'total' => ['nullable', 'numeric', 'min:0'],
            'touristTax' => ['nullable', 'numeric', 'min:0'],
            'note' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
