<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Table('reservations')]
#[Fillable(['date_arrivee', 'date_depart', 'nombre_nuits', 'adultes', 'enfants', 'prix_total', 'taxe_sejour', 'statut', 'type', 'note'])]
class Booking extends Model
{
    use HasFactory;

    protected $attributes = [
        'statut' => 'en attente',
        'type' => 'Classique',
    ];

    protected function casts(): array
    {
        return [
            'date_arrivee' => 'date:Y-m-d',
            'date_depart' => 'date:Y-m-d',
            'nombre_nuits' => 'integer',
            'adultes' => 'integer',
            'enfants' => 'integer',
            'prix_total' => 'decimal:2',
            'taxe_sejour' => 'decimal:2',
            'statut' => BookingStatus::class,
            'type' => BookingType::class,
        ];
    }

    public function clients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class, 'reservations_clients', 'id_reservation', 'id_client')
            ->withTimestamps();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'id_reservation');
    }

    public function primaryClient(): ?Client
    {
        return $this->clients->first();
    }

    /**
     * Réservations validées qui occupent au moins une nuit de la période [checkIn, checkOut[.
     */
    public function scopeOverlapping(Builder $query, string $checkIn, string $checkOut): void
    {
        $query->where($this->qualifyColumn('statut'), BookingStatus::Validated)
            ->where($this->qualifyColumn('date_arrivee'), '<', $checkOut)
            ->where($this->qualifyColumn('date_depart'), '>', $checkIn);
    }
}
