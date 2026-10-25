<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('paiements')]
#[Fillable(['id_reservation', 'montant_paiement', 'date_paiement', 'moyen_paiement', 'statut', 'note'])]
class Payment extends Model
{
    use HasFactory;

    protected $attributes = [
        'statut' => 'confirmé',
    ];

    protected function casts(): array
    {
        return [
            'id_reservation' => 'integer',
            'montant_paiement' => 'decimal:2',
            'date_paiement' => 'date:Y-m-d',
            'statut' => PaymentStatus::class,
        ];
    }

    public function isDraft(): bool
    {
        return $this->statut === PaymentStatus::Draft;
    }

    /**
     * Un remboursement est un paiement encaissé de montant négatif.
     */
    public function isRefund(): bool
    {
        return ! $this->isDraft() && $this->montant_paiement < 0;
    }

    public function scopeConfirmed(Builder $query): void
    {
        $query->where($this->qualifyColumn('statut'), PaymentStatus::Confirmed);
    }

    public function scopeDraft(Builder $query): void
    {
        $query->where($this->qualifyColumn('statut'), PaymentStatus::Draft);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'id_reservation');
    }
}
