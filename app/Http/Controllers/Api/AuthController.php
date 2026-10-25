<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BusinessException;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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

    public function index(): JsonResponse
    {
        return response()->json(['users' => User::orderBy('name')->get()]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->is($request->user())) {
            throw new BusinessException(__('errors.cannot_delete_self'));
        }

        $user->delete();

        return response()->json(['success' => true]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        return response()->json(['user' => $user], 201);
    }

    /**
     * Change le mot de passe de l'administrateur connecté.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $this->checkPassword($user, $request->input('current_password'))) {
            throw ValidationException::withMessages([
                'current_password' => __('errors.wrong_current_password'),
            ]);
        }

        $user->update(['password' => $request->input('password')]);

        return response()->json(['success' => true]);
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
