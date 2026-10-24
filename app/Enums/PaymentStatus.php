<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Confirmed = 'confirmé';
    case Draft = 'brouillon';
}
