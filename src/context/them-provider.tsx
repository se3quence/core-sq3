'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  disableTransitionOnChange?: boolean
}

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'light',
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'light',
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    if (attribute === 'class') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme, attribute])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

