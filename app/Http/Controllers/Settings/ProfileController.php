<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Expenses/Profile', [
            'user' => $request->user(),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'settings' => [
                'currency' => $request->user()->currency ?? 'USD',
                'monthly_budget' => $request->user()->monthly_budget ?? '',
                'theme' => $request->user()->theme ?? 'light',
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            $user = $request->user();

            // Update basic profile information
            $user->fill([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // If email is changed, reset email verification
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // Update password if provided and validated
            if (isset($validated['password']) && !empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
                Log::info('Password updated for user', ['user_id' => $user->id]);
            }

            // Save all changes
            $user->save();

            // Clear any existing sessions if password was changed
            if (isset($validated['password']) && !empty($validated['password'])) {
                // Regenerate session to prevent session fixation
                $request->session()->regenerate();
            }

            return redirect()->back()->with('status', 'Profile updated successfully!');
            
        } catch (\Exception $e) {
            Log::error('Profile update error', [
                'user_id' => $request->user()->id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->withErrors([
                'error' => 'An error occurred while updating your profile. Please try again.'
            ])->withInput($request->except(['current_password', 'password', 'password_confirmation']));
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}