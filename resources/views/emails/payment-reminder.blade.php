@extends('emails.layout')

@section('content')
    <h4>{{ __('mail.hello') }}</h4>
    <p>{{ __('mail.reminder.intro', ['days' => $days]) }}</p>
    <p>{{ __('mail.reminder.balance', ['amount' => $balance]) }}</p>
    <p>{{ __('mail.reminder.ignore') }}</p>
    @include('emails.partials.signature', ['regards' => __('mail.reminder.regards'), 'host' => __('mail.reminder.host')])
@endsection
