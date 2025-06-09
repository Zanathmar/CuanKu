<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [ExpenseController::class, 'index'])->name('home');
    Route::get('/dashboard', [ExpenseController::class, 'index'])->name('dashboard');
    Route::resource('expenses', ExpenseController::class)->except(['show']);
    Route::post('/balance', [ExpenseController::class, 'addBalance'])->name('income.store'); 

    
    Route::post('/income', [ExpenseController::class, 'addBalance'])->name('income.store');
    Route::delete('/income/{income}', [ExpenseController::class, 'destroyIncome'])->name('income.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';