import React, { useState, useCallback } from 'react'
import { useForm } from '@inertiajs/react'
import { User, Mail, Lock, Eye, EyeOff, Save, AlertCircle } from 'lucide-react'

interface ProfileFormProps {
  user: any
  onSuccess?: () => void
}

export default function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
    name: user.name || '',
    email: user.email || '',
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    clearErrors();
    
    // Prepare data for submission
    const submitData: any = {
      name: data.name,
      email: data.email,
    };

    // Only include password fields if current_password is provided
    if (data.current_password.trim()) {
      submitData.current_password = data.current_password;
      submitData.password = data.password;
      submitData.password_confirmation = data.password_confirmation;
    }
    
    patch(route('profile.update'), {
      data: submitData,
      preserveScroll: true,
      onSuccess: () => {
        // Reset password fields on success
        reset('current_password', 'password', 'password_confirmation');
        onSuccess?.();
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
        // Reset password fields on error
        reset('current_password', 'password', 'password_confirmation');
      }
    });
  };

  // Memoize handlers untuk mencegah re-render
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setData('name', e.target.value);
  }, [setData]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setData('email', e.target.value);
  }, [setData]);

  const handleCurrentPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setData('current_password', e.target.value);
  }, [setData]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setData('password', e.target.value);
  }, [setData]);

  const handlePasswordConfirmationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setData('password_confirmation', e.target.value);
  }, [setData]);

  // Memoize toggle functions
  const toggleCurrentPassword = useCallback(() => {
    setShowCurrentPassword(prev => !prev);
  }, []);

  const toggleNewPassword = useCallback(() => {
    setShowNewPassword(prev => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  // Check if password change is being attempted
  const isChangingPassword = data.current_password.trim() || data.password.trim() || data.password_confirmation.trim();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Personal Information</h2>
          <p className="text-gray-500 text-sm">Update your account details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.name}
                onChange={handleNameChange}
                placeholder="Enter your full name"
                className={`text-slate-900 w-full px-4 py-3 border rounded-xl transition-all duration-200 bg-white border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:shadow-sm focus:outline-none ${
                  errors.name ? 'border-red-400 ring-2 ring-red-100' : ''
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={data.email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className={`text-slate-900 w-full px-4 py-3 border rounded-xl transition-all duration-200 bg-white border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:shadow-sm focus:outline-none ${
                  errors.email ? 'border-red-400 ring-2 ring-red-100' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Password Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
          <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
          
          {/* Current Password Field */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={data.current_password}
                onChange={handleCurrentPasswordChange}
                placeholder="Enter current password to change password"
                className={`text-slate-900 w-full px-4 pr-12 py-3 border rounded-xl transition-all duration-200 bg-white border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:shadow-sm focus:outline-none ${
                  errors.current_password ? 'border-red-400 ring-2 ring-red-100' : ''
                }`}
              />
              <button
                type="button"
                onClick={toggleCurrentPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.current_password}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  disabled={!data.current_password.trim()}
                  className={`text-slate-900 w-full px-4 pr-12 py-3 border rounded-xl transition-all duration-200 bg-white border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${
                    errors.password ? 'border-red-400 ring-2 ring-red-100' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleNewPassword}
                  disabled={!data.current_password.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.password_confirmation}
                  onChange={handlePasswordConfirmationChange}
                  placeholder="Confirm your new password"
                  disabled={!data.current_password.trim()}
                  className={`text-slate-900 w-full px-4 pr-12 py-3 border rounded-xl transition-all duration-200 bg-white border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${
                    errors.password_confirmation ? 'border-red-400 ring-2 ring-red-100' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  disabled={!data.current_password.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={processing}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {processing ? 'Saving...' : isChangingPassword ? 'Update Profile & Password' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}