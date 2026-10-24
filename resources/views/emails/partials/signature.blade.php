<p>{!! __('mail.contact', [
    'phone' => e(config('tidolasab.contact_phone')),
    'phone_link' => preg_replace('/\s+/', '', config('tidolasab.contact_phone')),
    'email' => e(config('tidolasab.admin_email')),
]) !!}</p>
<p>{{ $regards ?? __('mail.regards') }}</p>
@isset($host)
    <p>{{ $host }}</p>
@endisset
<p>{{ __('mail.signature') }}</p>
