'use client'

import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';

// Simple Eye icon component
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Simple EyeOff icon component
const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Login successful!');
        router.push('/');
      } else {
        // Handle additional verification steps if needed
        toast.error('Please complete additional verification steps');
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || 'An error occurred during sign in';
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

  const handleForgotPassword = () => {
    router.push('/auth/sign-in#reset-password');
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
                <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
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

                  {/* Password Input */}
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[14px] text-nowrap">
                        <p className="leading-[21px]">Password</p>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4913ec] text-[14px] text-nowrap hover:underline"
                      >
                        <p className="leading-[20px]">Forgot password?</p>
                      </button>
                    </div>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors({ ...errors, password: undefined });
                          }
                        }}
                        placeholder="Enter your password"
                        className={`w-full h-[48px] px-[17px] pr-[48px] rounded-[8px] border font-['Inter:Regular',sans-serif] text-[16px] text-[#131118] placeholder:text-[#6b6189] focus:outline-none focus:ring-1 ${
                          errors.password
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#dedbe6] focus:border-[#4913ec] focus:ring-[#4913ec]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-[12px] top-1/2 -translate-y-1/2 p-[4px] hover:bg-gray-100 rounded"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5 text-[#6b6189]" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-[#6b6189]" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-[11px] leading-[14px] mt-[2px] font-['Inter:Regular',sans-serif]">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#4913ec] h-[48px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full hover:bg-[#3a0fc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                      <div className="content-stretch flex items-center justify-center px-[16px] py-0 relative size-full">
                        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[0.24px]">
                          <p className="leading-[24px]">{isLoading ? 'Logging in...' : 'Log In'}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </form>

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
