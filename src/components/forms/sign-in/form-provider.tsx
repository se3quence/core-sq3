'use client'

import React, { createContext, useContext } from 'react'

interface SignInFormContextType {
  // Add your form state here
}

const SignInFormContext = createContext<SignInFormContextType | undefined>(undefined)

export default function SignInFormProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SignInFormContext.Provider value={{}}>
      {children}
    </SignInFormContext.Provider>
  )
}

export const useSignInForm = () => {
  const context = useContext(SignInFormContext)
  if (!context) {
    throw new Error('useSignInForm must be used within SignInFormProvider')
  }
  return context
}

