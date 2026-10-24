@extends('emails.layout')

@section('content')
    <h4>Nouveau message de {{ $name }} ({{ $email }}) :</h4>
    <blockquote style="margin: 0 0 0 0.8ex; border-left: 1px solid #ccc; padding-left: 1ex; white-space: pre-line;">{{ $body }}</blockquote>
@endsection
