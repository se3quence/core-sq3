'use client'

import React, { useState } from 'react'
import MessageCard from './message-card'

/**
 * Example usage of MessageCard component
 * 
 * Usage for Session messages:
 * 
 * <MessageCard
 *   variant="session"
 *   title="Session Notice"
 *   message="Session already exists. You are already logged in."
 *   onClose={() => setShowMessage(false)}
 * />
 * 
 * <MessageCard
 *   variant="success"
 *   title="Success!"
 *   message="Your account has been created successfully."
 *   onClose={() => setShowMessage(false)}
 * />
 * 
 * <MessageCard
 *   variant="error"
 *   title="Error"
 *   message="Something went wrong. Please try again."
 *   onClose={() => setShowMessage(false)}
 * />
 * 
 * <MessageCard
 *   variant="warning"
 *   message="Your session will expire soon."
 * />
 * 
 * <MessageCard
 *   variant="info"
 *   title="Information"
 *   message="Please check your email for verification."
 * />
 */

export default function MessageCardExample() {
  const [showSession, setShowSession] = useState(true)
  const [showSuccess, setShowSuccess] = useState(true)
  const [showError, setShowError] = useState(true)
  const [showWarning, setShowWarning] = useState(true)
  const [showInfo, setShowInfo] = useState(true)

  return (
    <div className="space-y-4 p-4 max-w-md">
      {showSession && (
        <MessageCard
          variant="session"
          title="Session Notice"
          message="Session already exists. You are already logged in."
          onClose={() => setShowSession(false)}
        />
      )}

      {showSuccess && (
        <MessageCard
          variant="success"
          title="Success!"
          message="Your account has been created successfully."
          onClose={() => setShowSuccess(false)}
        />
      )}

      {showError && (
        <MessageCard
          variant="error"
          title="Error"
          message="Something went wrong. Please try again."
          onClose={() => setShowError(false)}
        />
      )}

      {showWarning && (
        <MessageCard
          variant="warning"
          title="Warning"
          message="Your session will expire soon."
          onClose={() => setShowWarning(false)}
        />
      )}

      {showInfo && (
        <MessageCard
          variant="info"
          title="Information"
          message="Please check your email for verification."
          onClose={() => setShowInfo(false)}
        />
      )}
    </div>
  )
}

