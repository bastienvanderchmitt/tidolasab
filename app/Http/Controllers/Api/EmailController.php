<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BusinessException;
use App\Http\Controllers\Controller;
use App\Mail\StoredEmail;
use App\Models\SentEmail;
use App\Services\EmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EmailController extends Controller
{
    /**
     * Pixel transparent de 1 × 1 pixel au format GIF.
     */
    private const PIXEL = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    public function __construct(private readonly EmailService $emails) {}

    public function index(Request $request): JsonResponse
    {
        $emails = SentEmail::query()
            ->select('emails.*')
            ->selectRaw("CONCAT(c.nom, ' ', c.prenom) as nom_client")
            ->leftJoin('clients as c', 'c.id', '=', 'emails.id_client')
            ->when($request->integer('booking'), fn ($query, $id) => $query->where('id_reservation', $id))
            ->when($request->integer('client'), fn ($query, $id) => $query->where('id_client', $id))
            ->latest('emails.id')
            ->limit(1000)
            ->get();

        return response()->json(['emails' => $emails]);
    }

    public function show(SentEmail $email): JsonResponse
    {
        return response()->json(['email' => $email->makeVisible('html')]);
    }

    /**
     * Renvoie le même contenu au même destinataire (sans les pièces jointes).
     */
    public function resend(SentEmail $email): JsonResponse
    {
        if (! $email->html) {
            throw new BusinessException(__('booking.email_not_resendable'));
        }

        $copy = $this->emails->send(
            $email->destinataire,
            (new StoredEmail($email->sujet ?? config('app.name'), $email->html))->locale($email->langue),
            $email->booking,
            $email->client,
            $email->type,
        );

        return response()->json(['emailId' => $copy?->id], 201);
    }

    /**
     * Chargé par la messagerie du destinataire à l'ouverture de l'email.
     */
    public function pixel(string $token): Response
    {
        SentEmail::where('token', $token)->get()->each(function (SentEmail $email) {
            $email->ouvert_le ??= now();
            $email->ouvertures++;
            $email->save();
        });

        return response(base64_decode(self::PIXEL), 200, [
            'Content-Type' => 'image/gif',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        ]);
    }
}
