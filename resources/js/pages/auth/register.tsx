import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, Receipt, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center p-4">
            <Head title="Register" />
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-blue-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main register card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
                    
                    {/* Header section matching sidebar branding */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <Receipt className="w-8 h-8 text-white" />
                        </div>
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Join CuanKu
                            </h1>
                            <p className="text-sm text-gray-500">
                                Expense Tracker
                            </p>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Create your account to start tracking expenses and managing your finances
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Name field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                Full Name
                            </Label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    disabled={processing}
                                    placeholder="Enter your full name"
                                    className={`w-full px-4 py-3 text-slate-900 border rounded-xl transition-all duration-200 bg-white ${
                                        focusedField === 'name' 
                                            ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    } ${errors.name ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                Email Address
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    disabled={processing}
                                    placeholder="Enter your email address"
                                    className={`w-full px-4 py-3 text-slate-900 border rounded-xl transition-all duration-200 bg-white ${
                                        focusedField === 'email' 
                                            ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    } ${errors.email ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-blue-600" />
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    disabled={processing}
                                    placeholder="Create a strong password"
                                    className={`w-full px-4 pr-12 py-3 text-slate-900 border rounded-xl transition-all duration-200 bg-white ${
                                        focusedField === 'password' 
                                            ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    } ${errors.password ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password field */}
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-blue-600" />
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    onFocus={() => setFocusedField('password_confirmation')}
                                    onBlur={() => setFocusedField(null)}
                                    disabled={processing}
                                    placeholder="Confirm your password"
                                    className={`w-full px-4 pr-12 py-3 text-slate-900 border rounded-xl transition-all duration-200 bg-white ${
                                        focusedField === 'password_confirmation' 
                                            ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    } ${errors.password_confirmation ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Submit button */}
                        <Button 
                            type="submit" 
                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                            tabIndex={5} 
                            disabled={processing}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                                <span>{processing ? 'Creating account...' : 'Create Account'}</span>
                            </div>
                        </Button>
                    </form>

                    {/* Footer section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <TextLink 
                                href={route('login')} 
                                tabIndex={6}
                                className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                                Sign in here
                            </TextLink>
                        </div>
                    </div>
                </div>

                {/* Subtle decorative element */}
                <div className="absolute -z-10 top-8 left-8 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
        </div>
    );
}