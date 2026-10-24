@extends('emails.layout')

@section('content')
    <h4>
        Réservation de
        @if ($client)
            <a href="{{ url('/admin/client/'.$client->id) }}">{{ $client->fullName() }}</a>
        @else
            {{ $booking->type->value }}
        @endif
    </h4>
    <ul>
        <li>Du {{ $booking->date_arrivee->format('d/m/Y') }} au {{ $booking->date_depart->format('d/m/Y') }} ({{ $booking->nombre_nuits }} nuits)</li>
        <li>{{ $booking->adultes }} adultes, {{ $booking->enfants }} enfants</li>
        <li>Pour un total de {{ \App\Support\Money::format($booking->prix_total) }} €</li>
        <li>Type : {{ $booking->type->value }}</li>
    </ul>
    @if ($fullPayment && $booking->type->value === 'Classique')
        <p><strong>Arrivée dans moins de 15 jours : le règlement de la totalité a été demandé au client.</strong></p>
    @endif
    @if ($client)
        <h5>Informations client :</h5>
        <ul>
            <li>Email : {{ $client->email }}</li>
            <li>Téléphone : {{ $client->telephone }}</li>
            <li>Adresse : {{ $client->adresse }}</li>
        </ul>
    @endif
@endsection
