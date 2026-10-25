<?php

namespace App\Models;

use App\Enums\EmailStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * Un email envoyé (ou en cours d'envoi) par le site, avec son statut :
 * en file, envoyé ou échec. L'ouverture est détectée par un pixel invisible,
 * c'est donc une indication : certaines messageries bloquent les images,
 * d'autres les chargent sans que l'email soit lu.
 */
#[Table('emails')]
#[Fillable(['type', 'destinataire', 'sujet', 'langue', 'id_reservation', 'id_client', 'statut', 'erreur', 'html', 'envoye_le', 'ouvert_le', 'ouvertures'])]
#[Hidden(['token', 'html'])]
class SentEmail extends Model
{
    use Prunable;

    /**
     * En-tête qui relie le message envoyé à sa ligne de suivi.
     */
    public const TRACKING_HEADER = 'X-Tidolasab-Email';

    protected $attributes = [
        'statut' => 'en file',
    ];

    protected static function booted(): void
    {
        static::creating(fn (SentEmail $email) => $email->token ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return [
            'id_reservation' => 'integer',
            'id_client' => 'integer',
            'statut' => EmailStatus::class,
            'envoye_le' => 'datetime',
            'ouvert_le' => 'datetime',
            'ouvertures' => 'integer',
        ];
    }

    /**
     * L'historique est conservé deux ans (« php artisan model:prune »).
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subYears(2));
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'id_reservation');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'id_client');
    }
}
