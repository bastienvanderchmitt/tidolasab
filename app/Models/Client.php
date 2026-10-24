<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Table('clients')]
#[Fillable(['nom', 'prenom', 'email', 'telephone', 'adresse', 'note', 'language'])]
class Client extends Model
{
    use HasFactory;

    protected $attributes = [
        'language' => 'fr',
    ];

    public function bookings(): BelongsToMany
    {
        return $this->belongsToMany(Booking::class, 'reservations_clients', 'id_client', 'id_reservation')
            ->withTimestamps();
    }

    public function fullName(): string
    {
        return trim($this->nom.' '.$this->prenom);
    }

    /**
     * Langue des emails : français, sinon anglais.
     */
    public function mailLocale(): string
    {
        return $this->language === 'fr' ? 'fr' : 'en';
    }
}
