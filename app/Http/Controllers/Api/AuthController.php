<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BusinessException;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('login', $request->input('login'))->first();

        if (! $user || ! $this->checkPassword($user, $request->input('password'))) {
            throw new BusinessException(__('errors.invalid_credentials'));
        }

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $user]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        return response()->json(['user' => $user], 201);
    }

    /**
     * Accepte aussi les mots de passe de l'ancienne API et les convertit au passage.
     */
    private function checkPassword(User $user, string $password): bool
    {
        if (Hash::check($password, $user->password)) {
            return true;
        }

        $salt = config('tidolasab.legacy_password_salt');
        if ($salt && password_verify($user->login.$salt.trim($password), $user->password)) {
            $user->update(['password' => $password]);

            return true;
        }

        return false;
    }
}
