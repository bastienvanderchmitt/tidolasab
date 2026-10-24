<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <title>{{ $subject ?? config('app.name') }}</title>
</head>
<body style="margin: 0;">
    <div style="background-color: #b2dfdb; font-family: Arial, sans-serif; padding: 40px;">
        <div style="text-align: center;">
            <img src="{{ asset('images/logo.png') }}" alt="Ti' Dola Sab" style="margin: 20px auto;">
        </div>
        <div style="width: 80%; margin: 40px auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            @yield('content')
        </div>
    </div>
</body>
</html>
