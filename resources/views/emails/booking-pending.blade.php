@extends('emails.layout')

@section('content')
    <h4>{{ __('mail.hello_name', ['name' => $client->fullName()]) }}</h4>
    <p>{{ __('mail.pending.thanks') }}</p>
    <p>{{ __('mail.pending.processing') }}</p>
    @include('emails.partials.signature')
@endsection
