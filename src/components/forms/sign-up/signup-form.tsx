'use client'

import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';

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

export default function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      toast.error('Please wait, authentication is loading...');
      return;
    }

    setIsLoading(true);
    
    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    const firstName = (nameParts[0] || fullName.trim()).trim();
    const lastName = (nameParts.slice(1).join(' ') || '').trim();
    
    // Ensure we have valid values
    if (!firstName || firstName.length === 0) {
      toast.error('First name is required');
      setIsLoading(false);
      return;
    }
    
    if (!email.trim() || email.trim().length === 0) {
      toast.error('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }
    
    try {
      // Log the data being sent for debugging
      console.log('Creating sign up with:', {
        firstName,
        lastName: lastName || firstName, // Use firstName as fallback for lastName
        emailAddress: email.trim(),
        passwordLength: password.length,
      });

      // Ensure email is properly formatted
      const emailAddress = email.trim().toLowerCase();
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
        toast.error('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const result = await signUp.create({
        firstName: firstName.trim(),
        lastName: (lastName || firstName).trim(), // Clerk requires lastName, use firstName if empty
        emailAddress,
        password: password, // Don't trim password - whitespace might be intentional
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else {
        // If email verification is required
        if (result.status === 'missing_requirements') {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          toast.success('Please check your email for verification code');
          router.push('/auth/sign-up/verify');
        } else {
          toast.info('Please complete additional steps');
        }
      }
    } catch (err: any) {
      // Comprehensive error logging - handle non-serializable errors
      let errorDetails: any = {};
      try {
        errorDetails = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
      } catch {
        // If JSON.stringify fails, extract properties manually
        errorDetails = {
          message: err?.message,
          name: err?.name,
          stack: err?.stack,
        };
        
        // Try to get all enumerable properties
        for (const key in err) {
          try {
            errorDetails[key] = err[key];
          } catch {
            errorDetails[key] = '[Non-serializable]';
          }
        }
      }
      
      console.error('Sign up error - Full error object:', errorDetails);
      console.error('Sign up error - Raw error:', err);
      
      // Try different error property paths
      const errors = err?.errors || err?.clerkError?.errors || err?.data?.errors || [];
      const status = err?.status || err?.clerkError?.status || err?.statusCode || 422;
      const statusText = err?.statusText || err?.clerkError?.statusText;
      
      // Log error details
      console.error('Sign up error details:', {
        errors: errors,
        status: status,
        statusText: statusText,
        message: err?.message,
        clerkError: err?.clerkError,
      });
      
      // Log all error details - access properties directly
      if (errors && errors.length > 0) {
        errors.forEach((error: any, index: number) => {
          // Access properties directly without serialization
          const code = error?.code;
          const message = error?.message;
          const longMessage = error?.longMessage;
          const meta = error?.meta;
          
          console.error(`Error ${index + 1}:`, {
            code: code,
            message: message,
            longMessage: longMessage,
            meta: meta,
          });
          
          // Also log the raw error to see its structure
          console.error(`Error ${index + 1} - Raw:`, error);
        });
      } else {
        // If no errors array, try to access error properties directly
        console.error('No errors array found. Trying direct access:');
        console.error('err.errors:', err?.errors);
        console.error('err.clerkError:', err?.clerkError);
        console.error('err.message:', err?.message);
        console.error('err.toString():', err?.toString?.());
        
        // Try to access ClerkError properties
        if (err?.clerkError) {
          console.error('clerkError.errors:', err.clerkError.errors);
          console.error('clerkError.status:', err.clerkError.status);
          console.error('clerkError.message:', err.clerkError.message);
        }
      }
      
      // Extract error message from various possible locations
      let errorMessage = 'An error occurred during sign up';
      let errorCode: string | undefined;
      
      try {
        errorMessage = 
          errors?.[0]?.longMessage || 
          errors?.[0]?.message || 
          err?.clerkError?.message ||
          err?.message ||
          errorMessage;
        
        errorCode = errors?.[0]?.code || err?.clerkError?.errors?.[0]?.code;
      } catch {
        // If extraction fails, use fallback
        errorMessage = err?.message || errorMessage;
      }
      
      // Handle specific error cases
      if (errorCode === 'form_identifier_exists') {
        toast.error('An account with this email already exists. Please sign in instead.');
      } else if (errorCode === 'form_password_length_too_short') {
        toast.error('Password is too short. Please use at least 8 characters.');
      } else if (errorCode === 'form_password_validation_failed') {
        toast.error('Password does not meet requirements.');
      } else if (errorCode === 'form_param_format_invalid') {
        toast.error('Invalid format. Please check your email and password.');
      } else if (errorCode === 'captcha_invalid') {
        toast.error('CAPTCHA verification failed. Please try again.');
      } else if (status === 422) {
        // 422 Unprocessable Entity - validation error
        toast.error(errorMessage || 'Validation error. Please check all fields and try again.');
      } else if (status === 400) {
        toast.error(errorMessage || 'Bad request. Please check your information and try again.');
      } else {
        // Show the error message or a generic one
        const displayMessage = errorMessage || `Error: ${errorCode || status || 'Unknown error'}`;
        toast.error(displayMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) {
      toast.error('Please wait, authentication is loading...');
      return;
    }

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      console.error('Google sign up error:', err);
      const errorMessage = 
        err.errors?.[0]?.message || 
        err.errors?.[0]?.longMessage ||
        err?.message ||
        'An error occurred with Google sign up';
      toast.error(errorMessage);
    }
  };

  const handleSignIn = () => {
    router.push('/auth/sign-in');
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

        {/* Right Side - Sign Up Form */}
        <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative shrink-0 overflow-y-auto">
          <div className="flex flex-row items-center justify-center size-full py-[16px]">
            <div className="content-stretch flex items-center justify-center px-[32px] py-[16px] relative w-full max-w-[420px]">
              <div className="content-stretch flex flex-col gap-[16px] items-start max-w-[360px] relative shrink-0 w-full">
                {/* Header */}
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[20px] tracking-[-0.45px] w-full">
                    <p className="leading-[26px]">Create your account</p>
                  </div>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b6189] text-[12px] w-full">
                    <p className="leading-[18px]">Sign up to start managing your business conversations.</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
                  {/* Full Name Input */}
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[12px] text-nowrap">
                      <p className="leading-[16px]">Full Name</p>
                    </label>
                    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) {
                            setErrors({ ...errors, fullName: undefined });
                          }
                        }}
                        placeholder="John Doe"
                        className={`absolute inset-0 w-full h-full px-[12px] rounded-[6px] border font-['Inter:Regular',sans-serif] text-[14px] text-[#131118] placeholder:text-[#6b6189] focus:outline-none focus:ring-1 ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#dedbe6] focus:border-[#4913ec] focus:ring-[#4913ec]'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-[11px] leading-[14px] mt-[2px] font-['Inter:Regular',sans-serif]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[12px] text-nowrap">
                      <p className="leading-[16px]">Email</p>
                    </label>
                    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full">
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
                        className={`absolute inset-0 w-full h-full px-[12px] rounded-[6px] border font-['Inter:Regular',sans-serif] text-[14px] text-[#131118] placeholder:text-[#6b6189] focus:outline-none focus:ring-1 ${
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
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[12px] text-nowrap">
                      <p className="leading-[16px]">Password</p>
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors({ ...errors, password: undefined });
                          }
                          // Clear confirm password error if passwords match now
                          if (errors.confirmPassword && e.target.value === confirmPassword) {
                            setErrors({ ...errors, confirmPassword: undefined });
                          }
                        }}
                        placeholder="Enter your password"
                        className={`w-full h-[40px] px-[12px] pr-[38px] rounded-[6px] border font-['Inter:Regular',sans-serif] text-[14px] text-[#131118] placeholder:text-[#6b6189] focus:outline-none focus:ring-1 ${
                          errors.password
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#dedbe6] focus:border-[#4913ec] focus:ring-[#4913ec]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-[8px] top-1/2 -translate-y-1/2 p-[2px] hover:bg-gray-100 rounded"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-3.5 h-3.5 text-[#6b6189]" />
                        ) : (
                          <EyeIcon className="w-3.5 h-3.5 text-[#6b6189]" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-[11px] leading-[14px] mt-[2px] font-['Inter:Regular',sans-serif]">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    <label className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[12px] text-nowrap">
                      <p className="leading-[16px]">Confirm Password</p>
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: undefined });
                          }
                        }}
                        placeholder="Confirm your password"
                        className={`w-full h-[40px] px-[12px] pr-[38px] rounded-[6px] border font-['Inter:Regular',sans-serif] text-[14px] text-[#131118] placeholder:text-[#6b6189] focus:outline-none focus:ring-1 ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[#dedbe6] focus:border-[#4913ec] focus:ring-[#4913ec]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-[8px] top-1/2 -translate-y-1/2 p-[2px] hover:bg-gray-100 rounded"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="w-3.5 h-3.5 text-[#6b6189]" />
                        ) : (
                          <EyeIcon className="w-3.5 h-3.5 text-[#6b6189]" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-[11px] leading-[14px] mt-[2px] font-['Inter:Regular',sans-serif]">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Clerk CAPTCHA */}
                  <div id="clerk-captcha" className="w-full" />

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#4913ec] h-[40px] relative rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full hover:bg-[#3a0fc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                      <div className="content-stretch flex items-center justify-center px-[14px] py-0 relative size-full">
                        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white tracking-[0.24px]">
                          <p className="leading-[20px]">{isLoading ? 'Creating account...' : 'Sign Up'}</p>
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
                      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-nowrap">
                        <p className="leading-[18px]">Or continue with</p>
                      </div>
                    </div>
                    <div className="basis-0 grow h-px min-h-px min-w-px relative shrink-0">
                      <div aria-hidden="true" className="border-t border-[#dedbe6]" />
                    </div>
                  </div>
                </div>

                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full border border-[#dedbe6] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                    <div className="content-stretch flex gap-[6px] items-center justify-center px-[14px] py-px relative size-full">
                      <div className="h-[20px] relative shrink-0 w-[20px] flex items-center justify-center">
                        <GoogleIcon className="w-full h-full" />
                      </div>
                      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#131118] text-[12px] text-center text-nowrap tracking-[0.21px]">
                        <p className="leading-[17px]">Continue with Google</p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Sign In Link */}
                <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b6189] text-[12px] text-center text-nowrap">
                    <p className="leading-[16px]">Already have an account? </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#4913ec] text-[12px] text-center text-nowrap hover:underline ml-1"
                  >
                    <p className="leading-[16px]">Sign in</p>
                  </button>
                </div>

                {/* Copyright */}
                <div className="content-stretch flex flex-col items-center relative shrink-0 w-full pt-1">
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[10px] text-center w-full">
                    <p className="leading-[12px]">© 2025 Sequence3. All rights reserved.</p>
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

