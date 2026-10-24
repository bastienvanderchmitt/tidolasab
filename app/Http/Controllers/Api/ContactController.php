<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Mail\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(ContactRequest $request): JsonResponse
    {
        Mail::to(config('tidolasab.admin_email'))->send(new ContactMessage(
            $request->input('name'),
            $request->input('email'),
            $request->input('subject'),
            $request->input('message'),
        ));

        return response()->json(['success' => true]);
    }
}
