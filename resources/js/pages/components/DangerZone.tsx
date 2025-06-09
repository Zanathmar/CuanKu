import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { AlertCircle, Trash2 } from 'lucide-react'

interface DangerZoneProps {
  onAccountDeleted?: () => void
}

export default function DangerZone({ onAccountDeleted }: DangerZoneProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const { data: deleteData, setData: setDeleteData, delete: destroy, processing: deleteProcessing } = useForm({
    password: '',
  })

  const handleDeleteAccount = () => {
    destroy(route('profile.destroy'), {
      onFinish: () => setDeleteData('password', ''),
      onSuccess: () => {
        setShowDeleteModal(false)
        onAccountDeleted?.()
      }
    })
  }

  return (
    <>
      <div className="bg-white border border-red-200 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Danger Zone</h2>
            <p className="text-gray-500 text-sm">Permanently delete your account and all data</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">This action cannot be undone</h3>
              <p className="text-red-700 text-sm">
                Deleting your account will permanently remove all your data, including expenses, budgets, and settings.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Are you sure you want to delete your account? All of your data will be permanently removed.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deleteData.password}
                onChange={(e) => setDeleteData('password', e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteProcessing || !deleteData.password}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteProcessing ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}