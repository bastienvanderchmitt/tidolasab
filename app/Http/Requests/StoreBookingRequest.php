<?php

namespace App\Http\Requests;

use App\Enums\BookingType;
use App\Rules\PhoneNumber;
use App\Rules\PostalCode;
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
            'touristTax' => ['nullable', 'numeric', 'min:0'],
            'clientId' => ['nullable', 'integer', Rule::exists('clients', 'id')],
            'note' => ['nullable', 'string', 'max:5000'],
            'name' => [$clientField, 'string', 'max:255'],
            'firstName' => [$clientField, 'string', 'max:255'],
            'email' => [$clientField, 'email:rfc,strict', 'max:255'],
            'phone' => [$clientField, 'string', 'max:20', new PhoneNumber],
            'address' => [$clientField, 'string', 'min:5', 'max:1000', 'regex:/\pL/u'],
            'postalCode' => [$clientField, 'string', 'max:20', new PostalCode($this->input('countryCode'))],
            'city' => [$clientField, 'string', 'max:255', 'regex:/\pL/u'],
            'country' => [$clientField, 'string', 'max:255'],
            // Code ISO envoyé par le site public, pour le format du code postal
            'countryCode' => ['nullable', 'string', 'size:2', 'alpha'],
            'language' => ['nullable', 'string', 'size:2'],
            // Code reçu par email, exigé pour une réservation publique (EmailVerification)
            'verificationCode' => [$isAdmin ? 'nullable' : 'required', 'string', 'digits:6'],
        ];
    }
}
