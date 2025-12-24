'use client'

import React from 'react'
import { X, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SessionModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

const SessionModal = ({
  isOpen,
  onClose,
  title = 'Session Already Exists',
  message = 'You are already logged in. Please continue to your dashboard or sign out first.',
}: SessionModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Card */}
      <div
        className={cn(
          'relative w-full max-w-md rounded-lg border border-[#4913ec]/30 bg-white shadow-2xl',
          'transform transition-all duration-300 ease-out'
        )}
        style={{
          animation: 'modalFadeIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dedbe6] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4913ec]/10">
              <ShieldAlert className="h-5 w-5 text-[#4913ec]" />
            </div>
            <h3 className="text-lg font-semibold text-[#131118]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#6b6189] transition-colors hover:bg-gray-100 hover:text-[#131118]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm leading-6 text-[#6b6189]">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#dedbe6] p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#4913ec] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a0fc4] focus:outline-none focus:ring-2 focus:ring-[#4913ec] focus:ring-offset-2"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionModal

