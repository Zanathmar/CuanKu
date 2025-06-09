import React, { useState } from 'react'
import { Head, usePage } from '@inertiajs/react'
import Sidebar from '../components/Sidebar'
import ProfileForm from '../components/ProfileForm'
import DangerZone from '../components/DangerZone'
import StatusMessage from '../components/StatusMessage'

export default function Profile() {
  const { user, settings, status } = usePage().props as any
  const [activeTab, setActiveTab] = useState('profile')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <Head title="Profile Settings" />
      
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main Content */}
      <div className=" mt-8 flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-blue-700/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Header - Hidden on mobile since we have mobile header */}
            <div className="hidden lg:block mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your account information and preferences</p>
            </div>

            {/* Status Message */}
            <StatusMessage status={status} />

            {/* Profile Form */}
            <ProfileForm user={user} />

            {/* Danger Zone */}
            <DangerZone />
          </div>
        </div>
      </div>
    </div>
  )
}