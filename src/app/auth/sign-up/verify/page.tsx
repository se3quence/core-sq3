'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'
import { toast } from '@/lib/toast'
import OTPInput from '@/components/otp'
import Image from 'next/image'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp, setActive, isLoaded } = useSignUp()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) {
      toast.error('Please wait, authentication is loading...')
      return
    }

    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('Email verified successfully!')
        router.push('/dashboard')
      } else {
        toast.error('Verification failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      const errorMessage =
        err.errors?.[0]?.message ||
        err.errors?.[0]?.longMessage ||
        'Invalid verification code. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!isLoaded) {
      return
    }

    setIsLoading(true)

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setOtp('')
      toast.success('New verification code sent to your email!')
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.message ||
        'An error occurred while resending the code'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="content-stretch flex flex-col items-start relative size-full fixed inset-0 z-50" style={{ backgroundImage: "linear-gradient(90deg, rgb(239, 246, 255) 0%, rgb(239, 246, 255) 100%)" }}>
      <div className="content-stretch flex h-screen items-start relative shrink-0 w-full">
        {/* Left Side - Purple Background with Testimonial */}
        <div className="basis-0 bg-[rgba(73,19,236,0.05)] grow h-full min-h-px min-w-px relative shrink-0 hidden lg:block">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col justify-between p-[48px] relative size-full">
              {/* Background Image */}
              <div className="absolute content-stretch flex flex-col inset-0 items-start justify-center">
                <div className="basis-0 grow min-h-px min-w-px mix-blend-overlay opacity-90 relative shrink-0 w-full">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute h-full left-[-12.5%] max-w-none top-0 w-[125%] bg-gradient-to-br from-purple-200 to-purple-400 opacity-30" />
                  </div>
                </div>
                <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundImage: "linear-gradient(128.66deg, rgba(73, 19, 236, 0.4) 0%, rgba(21, 16, 34, 0.8) 100%)" }} />
              </div>

              {/* Logo */}
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full z-10">
                <div className="h-[31px] relative shrink-0 w-[32px]">
                  <Image
                    src="/icons/Q-white.svg"
                    alt="Sequence3 Logo"
                    width={32}
                    height={31}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-nowrap text-white tracking-[-0.5px]">
                  <p className="leading-[28px]">Sequence3</p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[512px] z-10">
                <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[37.5px] not-italic relative shrink-0 text-[30px] text-white w-full">
                  <p className="mb-0">"Sequence3 has transformed how</p>
                  <p className="mb-0">we manage our client interactions,</p>
                  <p>cutting resolution times by 40%."</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - OTP Verification Form */}
        <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative shrink-0 overflow-y-auto">
          <div className="flex flex-row items-center justify-center size-full py-[16px]">
            <div className="content-stretch flex items-center justify-center px-[32px] py-[16px] relative w-full max-w-[420px]">
              <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[360px] relative shrink-0 w-full">
                {/* Header */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[30px] tracking-[-0.45px] w-full">
                    <p className="leading-[37.5px]">Verify your email</p>
                  </div>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b6189] text-[16px] w-full">
                    <p className="leading-[24px]">Enter the 6-digit code sent to your email address.</p>
                  </div>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleVerify} className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                  {/* OTP Input */}
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                    <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[14px] text-nowrap">
                      <p className="leading-[21px]">Verification Code</p>
                    </label>
                    <div className="w-full flex justify-center">
                      <OTPInput otp={otp} setOtp={setOtp} />
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="bg-[#4913ec] h-[48px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full hover:bg-[#3a0fc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                      <div className="content-stretch flex items-center justify-center px-[16px] py-0 relative size-full">
                        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[0.24px]">
                          <p className="leading-[24px]">{isLoading ? 'Verifying...' : 'Verify Email'}</p>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Resend Code */}
                  <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
                    <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b6189] text-[14px] text-center text-nowrap">
                      <p className="leading-[20px]">Didn't receive the code? </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4913ec] text-[14px] text-center text-nowrap hover:underline ml-1 disabled:opacity-50"
                    >
                      <p className="leading-[20px]">Resend</p>
                    </button>
                  </div>

                  {/* Back to Sign Up */}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/sign-up')}
                    className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4913ec] text-[14px] text-nowrap hover:underline"
                  >
                    <p className="leading-[20px]">← Back to sign up</p>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

