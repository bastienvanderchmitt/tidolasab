<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Transfer = 'virement';
    case Cash = 'espèces';
    case Cheque = 'chèque';
}
