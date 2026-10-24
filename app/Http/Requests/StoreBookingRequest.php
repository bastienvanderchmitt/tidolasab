<?php

namespace App\Http\Requests;

use App\Enums\BookingType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function rules(): array
    {
        $isAdmin = $this->user('sanctum') !== null;
        // L'admin peut saisir une réservation passée et sans coordonnées client
        $clientField = $isAdmin ? 'nullable' : 'required';

        return [
            'checkIn' => ['required', 'date_format:Y-m-d', ...($isAdmin ? [] : ['after_or_equal:today'])],
            'checkOut' => ['required', 'date_format:Y-m-d', 'after:checkIn'],
            'adults' => ['required', 'integer', 'min:1', 'max:20'],
            'children' => ['nullable', 'integer', 'min:0', 'max:20'],
            'type' => [$isAdmin ? 'required' : 'nullable', Rule::enum(BookingType::class)],
            'total' => ['nullable', 'numeric', 'min:0'],
            'note' => ['nullable', 'string', 'max:5000'],
            'name' => [$clientField, 'string', 'max:255'],
            'firstName' => [$clientField, 'string', 'max:255'],
            'email' => [$clientField, 'email', 'max:255'],
            'phone' => [$clientField, 'string', 'max:20'],
            'address' => [$clientField, 'string', 'max:1000'],
            'postalCode' => [$clientField, 'string', 'max:20'],
            'city' => [$clientField, 'string', 'max:255'],
            'country' => [$clientField, 'string', 'max:255'],
            'language' => ['nullable', 'string', 'size:2'],
        ];
    }
}
