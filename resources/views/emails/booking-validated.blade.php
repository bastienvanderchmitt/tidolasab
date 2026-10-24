@extends('emails.layout')

@section('content')
    <p>{{ __('mail.hello_name', ['name' => $client->fullName()]) }}</p>
    <p>{{ __('mail.validated.intro') }}</p>
    <table>
        <tr><th colspan="2" style="text-align: left;">{{ __('mail.validated.details') }}</th></tr>
        <tr><td>{{ __('mail.validated.people') }}</td><td>{{ $booking->adultes + $booking->enfants }}</td></tr>
        <tr><td>{{ __('mail.validated.arrival') }}</td><td>{{ $booking->date_arrivee->format('d/m/Y') }}</td></tr>
        <tr><td>{{ __('mail.validated.departure') }}</td><td>{{ $booking->date_depart->format('d/m/Y') }}</td></tr>
        <tr><td>{{ __('mail.validated.total') }}</td><td>{{ \App\Support\Money::format($booking->prix_total) }} €</td></tr>
        <tr><td>{{ __('mail.validated.deposit') }}</td><td>{{ \App\Support\Money::format($deposit) }} €</td></tr>
        @if ($balance > 0)
            <tr><td>{{ __('mail.validated.balance') }}</td><td>{{ \App\Support\Money::format($balance) }} €</td></tr>
        @endif
    </table>
    @if ($balance > 0)
        <p>{{ __('mail.validated.balance_due', ['date' => $balanceDueDate->format('d/m/Y')]) }}</p>
    @else
        <p>{{ __('mail.validated.fully_paid') }}</p>
    @endif
    @include('emails.partials.signature')
@endsection
