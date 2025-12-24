"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const InputOTPContext = React.createContext<{
  value: string[]
  setValue: (value: string[]) => void
  maxLength: number
} | null>(null)

export interface InputOTPProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  maxLength?: number
  value?: string
  onChange?: (value: string) => void
  children?: React.ReactNode
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, maxLength = 6, value = "", onChange, children, ...props }, ref) => {
    const [otp, setOtp] = React.useState<string[]>(() => {
      const initial = value.split("").slice(0, maxLength)
      while (initial.length < maxLength) {
        initial.push("")
      }
      return initial
    })

    React.useEffect(() => {
      const newOtp = value.split("").slice(0, maxLength)
      while (newOtp.length < maxLength) {
        newOtp.push("")
      }
      setOtp(newOtp)
    }, [value, maxLength])

    const handleChange = React.useCallback(
      (index: number, newValue: string) => {
        if (!/^\d*$/.test(newValue)) return

        const newOtp = [...otp]
        newOtp[index] = newValue.slice(-1)
        setOtp(newOtp)

        const otpValue = newOtp.join("")
        onChange?.(otpValue)

        // Auto-focus next input
        if (newValue && index < maxLength - 1) {
          const nextInput = document.getElementById(`otp-${index + 1}`)
          nextInput?.focus()
        }
      },
      [otp, maxLength, onChange]
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
          const prevInput = document.getElementById(`otp-${index - 1}`)
          prevInput?.focus()
        }
      },
      [otp]
    )

    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").slice(0, maxLength)
        if (!/^\d*$/.test(pastedData)) return

        const newOtp = pastedData.split("").slice(0, maxLength)
        while (newOtp.length < maxLength) {
          newOtp.push("")
        }
        setOtp(newOtp)
        onChange?.(newOtp.join(""))

        const nextIndex = Math.min(pastedData.length, maxLength - 1)
        const nextInput = document.getElementById(`otp-${nextIndex}`)
        nextInput?.focus()
      },
      [maxLength, onChange]
    )

    return (
      <InputOTPContext.Provider value={{ value: otp, setValue: handleChange, maxLength }}>
        <div
          ref={ref}
          className={cn("flex flex-col gap-2", className)}
          onPaste={handlePaste}
          {...props}
        >
          {children}
        </div>
      </InputOTPContext.Provider>
    )
  }
)
InputOTP.displayName = "InputOTP"

export interface InputOTPSlotProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  index: number
}

const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ className, index, ...props }, ref) => {
    const context = React.useContext(InputOTPContext)
    if (!context) {
      throw new Error("InputOTPSlot must be used within InputOTP")
    }

    const { value: otp, setValue: handleChange, maxLength } = context

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`)
        prevInput?.focus()
      }
      props.onKeyDown?.(e)
    }

    return (
      <input
        ref={ref}
        id={`otp-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={otp[index] || ""}
        onChange={(e) => handleChange(index, e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background text-center text-lg font-semibold transition-colors focus:border-[#4913ec] focus:outline-none focus:ring-1 focus:ring-[#4913ec] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPSlot }

