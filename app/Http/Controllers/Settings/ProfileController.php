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

            // Jika ada attempt untuk update password, validate current password
            if ($request->filled('current_password') || $request->filled('password')) {
                if (!$request->filled('current_password')) {
                    return redirect()->back()->withErrors([
                        'current_password' => 'Current password is required to change your password.'
                    ])->withInput($request->except(['current_password', 'password', 'password_confirmation']));
                }

                if (!Hash::check($request->current_password, $user->password)) {
                    return redirect()->back()->withErrors([
                        'current_password' => 'The current password is incorrect.'
                    ])->withInput($request->except(['current_password', 'password', 'password_confirmation']));
                }
            }

            // Update basic info
            $user->fill([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // Update password jika provided dan validated
            if (isset($validated['password']) && !empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return redirect()->back()->with('status', 'Profile updated successfully!');
            
        } catch (\Exception $e) {
            Log::error('Profile update error', [
                'user_id' => $request->user()->id ?? 'unknown',
                'error' => $e->getMessage()
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