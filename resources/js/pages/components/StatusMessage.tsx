import React from 'react'
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react'

interface StatusMessageProps {
  status?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  className?: string
}

export default function StatusMessage({ status, type = 'success', className = '' }: StatusMessageProps) {
  if (!status) return null

  const getStatusConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          Icon: CheckCircle
        }
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          Icon: XCircle
        }
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          Icon: AlertCircle
        }
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          Icon: Info
        }
      default:
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          Icon: CheckCircle
        }
    }
  }

  const config = getStatusConfig()
  const { bgColor, borderColor, textColor, iconColor, Icon } = config

  return (
    <div className={`mb-4 sm:mb-6 p-4 ${bgColor} border ${borderColor} rounded-xl flex items-start gap-3 ${className}`}>
      <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <span className={`${textColor} font-medium text-sm sm:text-base`}>{status}</span>
    </div>
  )
}