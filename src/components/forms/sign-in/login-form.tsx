'use client'

import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';

// Google logo icon component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="25"
    height="28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
  }>({});
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const validateEmail = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors: typeof errors = {};

    if (!otp.trim()) {
      newErrors.otp = 'OTP code is required';
    } else if (otp.trim().length !== 6) {
      newErrors.otp = 'OTP code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    if (!isLoaded) {
      toast.error('Please wait, authentication is loading...');
      return;
    }

    setIsLoading(true);
    
    try {
      // Ensure email is properly formatted
      const emailAddress = email.trim().toLowerCase();
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
        toast.error('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      console.log('Creating sign-in with identifier:', emailAddress);

      // Create the sign-in attempt
      const signInResult = await signIn.create({
        identifier: emailAddress,
      });

      console.log('Sign-in created:', {
        status: signInResult.status,
        supportedFirstFactors: signInResult.supportedFirstFactors,
        supportedStrategies: signInResult.supportedFirstFactors?.map((f: any) => f.strategy),
        firstFactorVerification: signInResult.firstFactorVerification,
      });

      // Check sign-in status
      if (signInResult.status === 'needs_first_factor') {
        // Check if email_code strategy is supported
        const emailCodeFactor = signInResult.supportedFirstFactors?.find(
          (factor: any) => factor.strategy === 'email_code'
        );

        if (!emailCodeFactor) {
          const availableStrategies = signInResult.supportedFirstFactors?.map((f: any) => f.strategy) || [];
          console.error('Email code strategy not supported. Available strategies:', availableStrategies);
          toast.error(`Email code authentication is not available. Available methods: ${availableStrategies.join(', ')}`);
          setIsLoading(false);
          return;
        }

        console.log('Preparing first factor with email_code strategy', {
          factor: emailCodeFactor,
        });

        // Prepare the first factor - try with the factor object if available
        try {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
          });
        } catch (prepareError: any) {
          // If prepareFirstFactor fails, log detailed error
          console.error('prepareFirstFactor error:', prepareError);
          throw prepareError; // Re-throw to be caught by outer catch
        }
      } else if (signInResult.status === 'complete') {
        // Sign-in is already complete (unlikely but possible)
        console.log('Sign-in already complete, setting active session');
        if (signInResult.createdSessionId) {
          await setActive({ session: signInResult.createdSessionId });
          toast.success('Login successful!');
          router.push('/');
          setIsLoading(false);
          return;
        }
      } else {
        console.error('Unexpected sign-in status:', signInResult.status);
        toast.error(`Unexpected sign-in status: ${signInResult.status}. Please try again.`);
        setIsLoading(false);
        return;
      }

      setIsOtpSent(true);
      toast.success('OTP code sent to your email!');
    } catch (err: any) {
      // Enhanced error logging
      console.error('=== Clerk Sign In Error ===');
      console.error('Error object:', err);
      
      const clerkError = err?.clerkError || err;
      const errors = clerkError?.errors || err?.errors || [];
      const status = clerkError?.status || err?.status || 422;
      
      console.error('Status:', status);
      console.error('Errors array:', errors);
      console.error('Error message:', clerkError?.message || err?.message);
      
      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach((error: any, index: number) => {
          console.error(`Error ${index + 1}:`, {
            code: error?.code,
            message: error?.message,
            longMessage: error?.longMessage,
            meta: error?.meta,
            param: error?.param,
          });
        });
      }

      // Extract user-friendly error message
      let errorMessage = 'An error occurred while sending OTP';
      let errorCode: string | undefined;

      if (errors && errors.length > 0) {
        const firstError = errors[0];
        errorCode = firstError?.code;
        errorMessage = firstError?.longMessage || firstError?.message || errorMessage;
      } else {
        errorMessage = clerkError?.message || err?.message || errorMessage;
      }

      // Handle specific error codes
      if (errorCode === 'form_identifier_not_found') {
        toast.error('No account found with this email address. Please sign up first.');
      } else if (errorCode === 'form_strategy_not_supported' || errorCode === 'strategy_not_available') {
        toast.error('Email code authentication is not enabled for sign-in. Please check your Clerk dashboard settings or use a different sign-in method.');
      } else if (errorCode === 'form_param_format_invalid') {
        toast.error('Invalid email format. Please check your email address.');
      } else if (errorCode === 'form_param_missing') {
        const param = errors[0]?.param || 'field';
        toast.error(`Missing required field: ${param}`);
      } else if (errorCode === 'form_identifier_not_verified') {
        toast.error('Email address is not verified. Please verify your email first.');
      } else if (errorCode === 'rate_limit_exceeded') {
        toast.error('Too many attempts. Please wait a moment and try again.');
      } else if (status === 422) {
        // 422 Unprocessable Entity - show specific error or generic message
        if (errorMessage && errorMessage !== 'An error occurred while sending OTP') {
          toast.error(errorMessage);
        } else if (errorCode) {
          toast.error(`Validation error (${errorCode}). Please check the console for details.`);
        } else {
          toast.error('Validation error. Please check your email and Clerk configuration.');
          console.error('422 error - Full details in console above');
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOtp()) {
      return;
    }

    if (!isLoaded) {
      toast.error('Please wait, authentication is loading...');
      return;
    }

    if (!signIn) {
      toast.error('Sign-in session expired. Please start over.');
      setIsOtpSent(false);
      setOtp('');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting to verify OTP code...');
      
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: otp.trim(),
      });

      console.log('OTP verification result:', {
        status: result.status,
        createdSessionId: result.createdSessionId,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Login successful!');
        router.push('/');
      } else {
        toast.error('Please complete additional verification steps');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      
      const clerkError = err?.clerkError || err;
      const errors = clerkError?.errors || err?.errors || [];
      const errorCode = errors?.[0]?.code;
      const errorMessage = errors?.[0]?.longMessage || 
                          errors?.[0]?.message || 
                          clerkError?.message || 
                          err?.message || 
                          'Invalid OTP code';
      
      // Handle specific error codes
      if (errorCode === 'form_code_incorrect') {
        toast.error('Invalid OTP code. Please check and try again.');
      } else if (errorCode === 'form_code_expired') {
        toast.error('OTP code has expired. Please request a new one.');
        setIsOtpSent(false);
        setOtp('');
      } else {
        toast.error(errorMessage);
      }
      
      setErrors({ ...errors, otp: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isLoaded) {
      toast.error('Please wait, authentication is loading...');
      return;
    }

    if (!signIn) {
      toast.error('Please start over. Sign-in session expired.');
      setIsOtpSent(false);
      setOtp('');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Resending OTP code...');
      
      await signIn.prepareFirstFactor({
        strategy: 'email_code',
      });

      setOtp('');
      toast.success('New OTP code sent to your email!');
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      
      const clerkError = err?.clerkError || err;
      const errors = clerkError?.errors || err?.errors || [];
      const errorMessage = errors?.[0]?.longMessage || 
                          errors?.[0]?.message || 
                          clerkError?.message || 
                          err?.message || 
                          'An error occurred while resending OTP';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || 'An error occurred with Google sign in';
      toast.error(errorMessage);
    }
  };

  const handleSignUp = () => {
    router.push('/auth/sign-up');
  };

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
                    {/* Background image placeholder - replace with actual image */}
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

        {/* Right Side - Login Form */}
        <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative shrink-0">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[48px] py-[48px] relative w-full max-w-[544px]">
              <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[448px] relative shrink-0 w-full">
                {/* Header */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[30px] tracking-[-0.45px] w-full">
                    <p className="leading-[37.5px]">Welcome back</p>
                  </div>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b6189] text-[16px] w-full">
                    <p className="leading-[24px]">Log in to manage your business conversations.</p>
                  </div>
                </div>

                {/* Form */}
                {!isOtpSent ? (
                  <form onSubmit={handleRequestOtp} className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                    {/* Email Input */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[14px] text-nowrap">
                        <p className="leading-[21px]">Email</p>
                      </label>
                      <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                              setErrors({ ...errors, email: undefined });
                            }
                          }}
                          placeholder="name@company.com"
                          className={`absolute inset-0 w-full h-full px-[17px] rounded-[8px] border font-['Inter:Regular',sans-serif] text-[16px] text-[#131118] placeholder:text-[#6b6189] focus:outline-none focus:ring-1 ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-[#dedbe6] focus:border-[#4913ec] focus:ring-[#4913ec]'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-[11px] leading-[14px] mt-[2px] font-['Inter:Regular',sans-serif]">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Send OTP Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#4913ec] h-[48px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full hover:bg-[#3a0fc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center justify-center px-[16px] py-0 relative size-full">
                          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[0.24px]">
                            <p className="leading-[24px]">{isLoading ? 'Sending...' : 'Send OTP Code'}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                    {/* Email Display */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[14px] text-nowrap">
                        <p className="leading-[21px]">Email</p>
                      </label>
                      <div className="bg-gray-50 h-[48px] relative rounded-[8px] shrink-0 w-full flex items-center px-[17px]">
                        <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[#6b6189]">{email}</p>
                      </div>
                    </div>

                    {/* OTP Input */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[14px] text-nowrap">
                        <p className="leading-[21px]">Enter OTP Code</p>
                      </label>
                      <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setOtp(value);
                            if (errors.otp) {
                              setErrors({ ...errors, otp: undefined });
                            }
                          }}
                          placeholder="000000"
                          maxLength={6}
                          className={`absolute inset-0 w-full h-full px-[17px] rounded-[8px] border font-['Inter:Regular',sans-serif] text-[16px] text-center text-[#131118] placeholder:text-[#6b6189] focus:outline-none focus:ring-1 tracking-widest ${
                            errors.otp
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-[#dedbe6] focus:border-[#4913ec] focus:ring-[#4913ec]'
                          }`}
                        />
                      </div>
                      {errors.otp && (
                        <p className="text-red-500 text-[11px] leading-[14px] mt-[2px] font-['Inter:Regular',sans-serif]">
                          {errors.otp}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4913ec] text-[14px] text-nowrap hover:underline mt-1"
                      >
                        <p className="leading-[20px]">Resend OTP Code</p>
                      </button>
                    </div>

                    {/* Verify OTP Button */}
                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="bg-[#4913ec] h-[48px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full hover:bg-[#3a0fc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center justify-center px-[16px] py-0 relative size-full">
                          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[0.24px]">
                            <p className="leading-[24px]">{isLoading ? 'Verifying...' : 'Verify & Log In'}</p>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Back to Email */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtp('');
                        setErrors({});
                      }}
                      className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4913ec] text-[14px] text-nowrap hover:underline"
                    >
                      <p className="leading-[20px]">← Use different email</p>
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="relative content-stretch flex inset-0 items-center justify-center w-full">
                    <div className="basis-0 grow h-px min-h-px min-w-px relative shrink-0">
                      <div aria-hidden="true" className="border-t border-[#dedbe6]" />
                    </div>
                    <div className="bg-white content-stretch flex flex-col items-start px-[8px] py-0 relative shrink-0">
                      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-nowrap">
                        <p className="leading-[20px]">Or continue with</p>
                      </div>
                    </div>
                    <div className="basis-0 grow h-px min-h-px min-w-px relative shrink-0">
                      <div aria-hidden="true" className="border-t border-[#dedbe6]" />
                    </div>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full border border-[#dedbe6] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                    <div className="content-stretch flex gap-[6px] items-center justify-center px-[17px] py-px relative size-full">
                      <div className="h-[28px] relative shrink-0 w-[25px] flex items-center justify-center">
                        <GoogleIcon className="w-full h-full" />
                      </div>
                      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[14px] text-center text-nowrap tracking-[0.21px]">
                        <p className="leading-[21px]">Continue with Google</p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Sign Up Link */}
                <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b6189] text-[14px] text-center text-nowrap">
                    <p className="leading-[20px]">Don't have an account? </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#4913ec] text-[14px] text-center text-nowrap hover:underline ml-1"
                  >
                    <p className="leading-[20px]">Sign up</p>
                  </button>
                </div>

                {/* Copyright */}
                <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] text-center w-full">
                    <p className="leading-[16px]">© 2025 Sequence3. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
