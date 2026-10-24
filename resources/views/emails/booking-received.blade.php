@extends('emails.layout')

@section('content')
    <h4>{{ __('mail.hello') }}</h4>
    <p>{{ __('mail.received.thanks') }}</p>
    <p>{{ __('mail.received.processing') }}</p>
    @if ($fullPayment)
        <p>{{ __('mail.received.full_payment', ['amount' => \App\Support\Money::format($amountDue), 'days' => $balanceDueDays + 1]) }}</p>
    @else
        <p>{{ __('mail.received.deposit', ['percent' => $depositPercent, 'amount' => \App\Support\Money::format($amountDue)]) }}</p>
        <p>{{ __('mail.received.balance', ['days' => $balanceDueDays]) }}</p>
    @endif
    @include('emails.partials.signature')
@endsection
