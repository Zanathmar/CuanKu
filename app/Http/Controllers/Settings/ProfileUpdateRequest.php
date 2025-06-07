<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'currency' => ['required', 'in:USD,IDR,EUR'],
            'monthly_budget' => ['nullable', 'numeric'],
            'theme' => ['required', 'in:light,dark'],
        ];
    }
}