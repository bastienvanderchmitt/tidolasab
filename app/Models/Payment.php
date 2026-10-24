<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('paiements')]
#[Fillable(['id_reservation', 'montant_paiement', 'date_paiement', 'moyen_paiement', 'note'])]
class Payment extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'id_reservation' => 'integer',
            'montant_paiement' => 'decimal:2',
            'date_paiement' => 'date:Y-m-d',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'id_reservation');
    }
}
