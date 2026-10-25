<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Mail\ContactMessage;
use App\Services\EmailService;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function send(ContactRequest $request, EmailService $emails): JsonResponse
    {
        $emails->send(config('tidolasab.admin_email'), new ContactMessage(
            $request->input('name'),
            $request->input('email'),
            $request->input('subject'),
            $request->input('message'),
        ));

        return response()->json(['success' => true]);
    }
}
