'use client'

import React from 'react'
import { InputOTP, InputOTPSlot } from '../ui/input-otp'

type Props = {
  otp: string
  setOtp: React.Dispatch<React.SetStateAction<string>>
}

const OTPInput = ({ otp, setOtp }: Props) => {
  return (
    <InputOTP
      maxLength={6}
      value={otp}
      onChange={(value) => setOtp(value)}
    >
      <div className="flex gap-3 justify-center">
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </div>
    </InputOTP>
  )
}

export default OTPInput
