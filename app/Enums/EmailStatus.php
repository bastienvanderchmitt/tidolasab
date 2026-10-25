<?php

namespace App\Enums;

enum EmailStatus: string
{
    case Queued = 'en file';
    case Sent = 'envoyé';
    case Failed = 'échec';
}
