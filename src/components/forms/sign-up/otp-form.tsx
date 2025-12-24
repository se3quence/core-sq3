'use client'

import React from 'react'
import { Dispatch, SetStateAction } from 'react'

type OTPFormProps = {
  onOTP: string
  setOTP: Dispatch<SetStateAction<string>>
}

const OTPForm = ({ onOTP, setOTP }: OTPFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="block text-sm font-medium mb-1">Enter OTP Code</label>
      <input
        type="text"
        value={onOTP}
        onChange={(e) => setOTP(e.target.value)}
        placeholder="Enter 6-digit code"
        maxLength={6}
        className="w-full px-3 py-2 border rounded-md"
      />
      <p className="text-xs text-gray-600">Please enter the 6-digit code sent to your email</p>
    </div>
  )
}

export default OTPForm

