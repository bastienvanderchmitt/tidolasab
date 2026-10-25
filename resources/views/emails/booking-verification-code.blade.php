@extends('emails.layout')

@section('content')
    <h4>{{ __('mail.hello') }}</h4>
    <p>{{ __('mail.verification.intro') }}</p>
    <p style="margin: 28px 0; text-align: center;">
        <span style="display: inline-block; padding: 14px 26px; font-size: 30px; font-weight: bold; letter-spacing: 10px; color: #007c84; background-color: #e1fbfc; border-radius: 10px;">{{ $code }}</span>
    </p>
    <p>{{ __('mail.verification.validity', ['minutes' => $minutes]) }}</p>
    <p style="color: #6b7280; font-size: 13px;">{{ __('mail.verification.ignore') }}</p>
    @include('emails.partials.signature')
@endsection
