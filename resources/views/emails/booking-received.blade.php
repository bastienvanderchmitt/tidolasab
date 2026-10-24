@extends('emails.layout')

@section('content')
    <h4>{{ __('mail.hello') }}</h4>
    <p>{{ __('mail.received.thanks') }}</p>
    <p>{{ __('mail.received.processing') }}</p>
    <p>{{ __('mail.received.deposit', ['percent' => $depositPercent, 'amount' => $depositAmount]) }}</p>
    <p>{{ __('mail.received.balance', ['days' => $balanceDueDays]) }}</p>
    @include('emails.partials.signature')
@endsection
