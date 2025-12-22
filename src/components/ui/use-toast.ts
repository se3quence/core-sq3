'use client'

import { useState, useCallback } from 'react'

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description }: { title?: string; description?: string }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title,
      description,
      variant: title === 'Error' ? 'destructive' : 'default',
    }

    setToasts((prev) => [...prev, newToast])

    // Show toast using the existing toast implementation
    const message = description || title || 'Notification'
    if (title === 'Error') {
      // Use the existing toast.error from lib/toast
      const { toast: libToast } = require('@/lib/toast')
      libToast.error(message)
    } else {
      const { toast: libToast } = require('@/lib/toast')
      libToast.success(message)
    }

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)

    return {
      id,
      dismiss: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }
  }, [])

  return {
    toast,
    toasts,
  }
}

