<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'en attente';
    case Validated = 'validée';
    case Cancelled = 'annulée';
}
