import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, Mail, Lock, Receipt } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center p-4">
            <Head title="Log in" />
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-blue-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main login card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
                    
                    {/* Header section matching sidebar branding */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <Receipt className="w-8 h-8 text-white" />
                        </div>
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Welcome to CuanKu
                            </h1>
                            <p className="text-sm text-gray-500">
                                Expense Tracker
                            </p>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Sign in to manage your expenses and track your spending
                        </p>
                    </div>

                    {/* Status message */}
                    {status && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-50 border border-green-200 rounded-xl">
                            <div className="text-center text-sm font-medium text-green-700">{status}</div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
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
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <TextLink 
                                        href={route('password.request')} 
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200" 
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
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

                        {/* Remember me checkbox */}
                        <div className="flex items-center space-x-3 py-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="w-5 h-5 rounded-lg border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all duration-200"
                            />
                            <Label htmlFor="remember" className="text-sm text-gray-700 font-medium cursor-pointer">
                                Remember me for 30 days
                            </Label>
                        </div>

                        {/* Submit button */}
                        <Button 
                            type="submit" 
                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                            tabIndex={4} 
                            disabled={processing}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                                <span>{processing ? 'Signing in...' : 'Sign In'}</span>
                            </div>
                        </Button>
                    </form>

                    {/* Footer section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <TextLink 
                                href={route('register')} 
                                tabIndex={5}
                                className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                                Create one now
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