<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // Redirect root settings ke profile
    Route::redirect('settings', 'settings/profile');

    // Profile routes - menggunakan resource pattern untuk konsistensi
    Route::prefix('settings')->name('profile.')->group(function () {
        Route::get('profile', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('profile', [ProfileController::class, 'update'])->name('update');
        Route::delete('profile', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Password routes - terpisah dari profile (jika diperlukan)
    Route::prefix('settings')->name('password.')->group(function () {
        Route::get('password', [PasswordController::class, 'edit'])->name('edit');
        Route::put('password', [PasswordController::class, 'update'])->name('update');
    });

    // Settings pages lainnya
    Route::prefix('settings')->group(function () {
        Route::get('appearance', function () {
            return Inertia::render('Settings/Appearance', [
                'user' => request()->user(),
            ]);
        })->name('settings.appearance');
        
        // Bisa ditambahkan routes settings lainnya di sini
        // Route::get('notifications', ...)->name('settings.notifications');
        // Route::get('security', ...)->name('settings.security');
    });
});