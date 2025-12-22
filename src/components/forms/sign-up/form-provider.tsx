'use client'

import React, { createContext, useContext } from 'react'

interface SignUpFormContextType {
  // Add your form state here
}

const SignUpFormContext = createContext<SignUpFormContextType | undefined>(undefined)

export default function SignUpFormProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SignUpFormContext.Provider value={{}}>
      {children}
    </SignUpFormContext.Provider>
  )
}

export const useSignUpForm = () => {
  const context = useContext(SignUpFormContext)
  if (!context) {
    throw new Error('useSignUpForm must be used within SignUpFormProvider')
  }
  return context
}

