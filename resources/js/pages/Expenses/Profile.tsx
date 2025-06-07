import React from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'

export default function Profile() {
  const { user, settings, status } = usePage().props as any

  const { data, setData, patch, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    currency: settings.currency || 'USD',
    monthly_budget: settings.monthly_budget || '',
    theme: settings.theme || 'light',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patch(route('profile.update'))
  }

  return (
    <>
      <Head title="Profile Settings" />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>

        {status && <div className="text-green-500">{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Currency */}
          <div>
            <label className="block mb-1 text-sm">Currency</label>
            <select
              value={data.currency}
              onChange={(e) => setData('currency', e.target.value)}
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
            >
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="EUR">EUR</option>
            </select>
            {errors.currency && <p className="text-red-500 text-sm">{errors.currency}</p>}
          </div>

          {/* Monthly Budget */}
          <div>
            <label className="block mb-1 text-sm">Monthly Budget</label>
            <input
              type="number"
              value={data.monthly_budget}
              onChange={(e) => setData('monthly_budget', e.target.value)}
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
            />
            {errors.monthly_budget && <p className="text-red-500 text-sm">{errors.monthly_budget}</p>}
          </div>

          {/* Theme */}
          <div>
            <label className="block mb-1 text-sm">Theme</label>
            <select
              value={data.theme}
              onChange={(e) => setData('theme', e.target.value)}
              className="w-full border p-2 rounded dark:bg-slate-700 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            {errors.theme && <p className="text-red-500 text-sm">{errors.theme}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={processing}
          >
            Save
          </button>
        </form>
      </div>
    </>
  )
}