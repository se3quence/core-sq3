'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle2, AlertCircle, Info, XCircle, ShieldAlert } from 'lucide-react'

export type MessageCardVariant = 'success' | 'error' | 'warning' | 'info' | 'session'

export interface MessageCardProps {
  variant?: MessageCardVariant
  title?: string
  message: string
  onClose?: () => void
  className?: string
  showIcon?: boolean
}

const variantStyles = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-800',
    message: 'text-green-700',
    close: 'text-green-600 hover:bg-green-100',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    message: 'text-red-700',
    close: 'text-red-600 hover:bg-red-100',
  },
  warning: {
    container: 'bg-orange-50 border-orange-200',
    icon: 'text-orange-600',
    title: 'text-orange-800',
    message: 'text-orange-700',
    close: 'text-orange-600 hover:bg-orange-100',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    message: 'text-blue-700',
    close: 'text-blue-600 hover:bg-blue-100',
  },
  session: {
    container: 'bg-[#4913ec]/10 border-[#4913ec]/30',
    icon: 'text-[#4913ec]',
    title: 'text-[#4913ec]',
    message: 'text-[#6b6189]',
    close: 'text-[#4913ec] hover:bg-[#4913ec]/10',
  },
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  session: ShieldAlert,
}

const MessageCard = ({
  variant = 'info',
  title,
  message,
  onClose,
  className,
  showIcon = true,
}: MessageCardProps) => {
  const styles = variantStyles[variant]
  const Icon = icons[variant]

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4 shadow-sm',
        styles.container,
        className
      )}
    >
      {showIcon && (
        <div className={cn('flex-shrink-0', styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={cn('text-sm font-semibold mb-1', styles.title)}>
            {title}
          </h3>
        )}
        <p className={cn('text-sm', styles.message)}>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'flex-shrink-0 rounded-md p-1 transition-colors',
            styles.close
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default MessageCard

