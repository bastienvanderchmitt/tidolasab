@extends('emails.layout')

@section('content')
    <h4>{{ __('mail.hello') }}</h4>
    <p>{{ __('mail.cancelled.body') }}</p>
    @include('emails.partials.signature')
@endsection
