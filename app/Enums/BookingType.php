<?php

namespace App\Enums;

enum BookingType: string
{
    case Classique = 'Classique';
    case Booking = 'Booking';
    case AirBnb = 'AirBnb';
    case Fermeture = 'Fermeture';
}
