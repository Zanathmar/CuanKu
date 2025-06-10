<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->user();
        
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 
                'email', 
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
        ];

        // Validate password fields if any password field is provided
        if ($this->filled('current_password') || $this->filled('password') || $this->filled('password_confirmation')) {
            $rules['current_password'] = ['required', 'current_password'];
            $rules['password'] = ['required', 'confirmed', Password::defaults()];
            $rules['password_confirmation'] = ['required'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'Current password is required to update your password.',
            'current_password.current_password' => 'The current password is incorrect.',
            'password.required' => 'New password is required.',
            'password.confirmed' => 'The password confirmation does not match.',
            'password_confirmation.required' => 'Password confirmation is required.',
            'email.unique' => 'This email address is already taken.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Clean up empty password fields
        if (empty($this->current_password) && empty($this->password) && empty($this->password_confirmation)) {
            $this->request->remove('current_password');
            $this->request->remove('password');
            $this->request->remove('password_confirmation');
        }
    }
}