import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Receipt, ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center p-4">
            <Head title="Forgot password" />
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-blue-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main forgot password card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
                    
                    {/* Header section matching sidebar branding */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <Receipt className="w-8 h-8 text-white" />
                        </div>
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Forgot Password
                            </h1>
                            <p className="text-sm text-gray-500">
                                CuanKu - Expense Tracker
                            </p>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Enter your email address and we'll send you a link to reset your password
                        </p>
                    </div>

                    {/* Status message */}
                    {status && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-50 border border-green-200 rounded-xl">
                            <div className="text-center text-sm font-medium text-green-700">{status}</div>
                        </div>
                    )}

                    <div className="space-y-6">
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
                                        name="email"
                                        autoComplete="email"
                                        value={data.email}
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter your email address"
                                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 bg-white ${
                                            focusedField === 'email' 
                                                ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        } ${errors.email ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Submit button */}
                            <Button 
                                type="submit"
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                                disabled={processing}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                                    <span>{processing ? 'Sending reset link...' : 'Send Reset Link'}</span>
                                </div>
                            </Button>
                        </form>

                        {/* Back to login link */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <TextLink 
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Sign In
                                </TextLink>
                            </div>
                        </div>
                    </div>

                    {/* Help section matching sidebar style */}
                    <div className="mt-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-medium text-gray-900 mb-2 text-sm">💡 Need Help?</h4>
                            <p className="text-xs text-gray-600">
                                If you don't receive the reset email within a few minutes, check your spam folder or try again.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subtle decorative element */}
                <div className="absolute -z-10 top-8 left-8 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
        </div>
    );
}