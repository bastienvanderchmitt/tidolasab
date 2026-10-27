<?php

namespace App\Enums;

enum BookingType: string
{
    case Classique = 'Classique';
    case Booking = 'Booking';
    case AirBnb = 'AirBnb';
    case Fermeture = 'Fermeture';

    /**
     * Réservation prise sur une plateforme, qui verse le séjour après le départ.
     */
    public function isPlatform(): bool
    {
        return $this === self::Booking || $this === self::AirBnb;
    }

    public function label(): string
    {
        return $this === self::AirBnb ? 'Airbnb' : $this->value;
    }
}
