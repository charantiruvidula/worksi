'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, User, Briefcase } from 'lucide-react';
import { useAuth, UserRole } from '@/lib/auth-context';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('customer');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password flow
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const roleParam = searchParams.get('role');
    if (modeParam === 'signup') setMode('signup');
    if (roleParam === 'provider' || roleParam === 'pro') setRole('provider');
    if (roleParam === 'customer' || roleParam === 'client') setRole('customer');
  }, [searchParams]);

  const handleAuthSuccess = (targetRole: UserRole, targetEmail: string, name?: string) => {
    login(targetEmail, targetRole, name);
    setIsLoading(false);
    if (targetRole === 'provider') {
      router.push('/provider');
    } else {
      router.push('/customer');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || (mode === 'signup' && !fullName)) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      handleAuthSuccess(role, email, fullName || undefined);
    }, 600);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const socialEmail = `user.${provider.toLowerCase()}@example.com`;
      handleAuthSuccess(role, socialEmail, `${provider} User`);
    }, 600);
  };


  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-white text-black flex flex-col justify-between font-sans antialiased">
      
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-6 md:px-14">
        <Link href="/" className="font-serif italic text-2xl font-bold tracking-tight text-black">
          Worksy
        </Link>

        {/* Mode Toggle Button in Header */}
        {mode === 'login' ? (
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className="text-[11px] font-bold tracking-widest text-black uppercase hover:opacity-70 transition-opacity"
          >
            CREATE ACCOUNT
          </button>
        ) : (
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className="text-[11px] font-bold tracking-widest text-black uppercase hover:opacity-70 transition-opacity"
          >
            LOG IN
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-4xl px-6 py-8 my-auto">
        {forgotOpen ? (
          /* Forgot Password View */
          <div className="max-w-md mx-auto py-8">
            <button
              onClick={() => {
                setForgotOpen(false);
                setResetSent(false);
                setErrorMsg('');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Log In
            </button>

            {resetSent ? (
              <div className="text-center py-6">
                <h3 className="text-2xl font-bold text-black">Check your inbox</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Instructions to reset your password have been sent to <span className="font-semibold text-black">{resetEmail}</span>.
                </p>
                <button
                  onClick={() => setResetSent(false)}
                  className="mt-8 w-full border border-black py-3 text-xs font-bold tracking-widest uppercase text-black hover:bg-black hover:text-white transition-colors"
                >
                  Resend Email
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black tracking-tight">Can&apos;t Log In?</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Enter your email address below and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border-b border-gray-300 pb-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'SEND RESET LINK'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Main Login / Signup Form */
          <div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-black mb-6">
              {mode === 'login' ? 'Log into Worksy' : 'Create your Worksy account'}
            </h1>

            {/* Role Selection Box */}
            <div className="max-w-md mx-auto mb-10">
              <label className="block text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                SELECT YOUR ROLE TO CONTINUE
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center justify-center py-3 px-4 rounded-md text-xs font-bold transition-all ${
                    role === 'customer'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-black hover:bg-white/50'
                  }`}
                >
                  <User size={18} className="mb-1" />
                  <span>CUSTOMER</span>
                  <span className={`text-[10px] font-normal mt-0.5 ${role === 'customer' ? 'text-gray-300' : 'text-gray-500'}`}>
                    I need a service
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`flex flex-col items-center justify-center py-3 px-4 rounded-md text-xs font-bold transition-all ${
                    role === 'provider'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-black hover:bg-white/50'
                  }`}
                >
                  <Briefcase size={18} className="mb-1" />
                  <span>SERVICE PROVIDER</span>
                  <span className={`text-[10px] font-normal mt-0.5 ${role === 'provider' ? 'text-gray-300' : 'text-gray-500'}`}>
                    I offer services
                  </span>
                </button>
              </div>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-10 md:gap-14 max-w-3xl mx-auto">
              
              {/* Left Column: Direct Form */}
              <form onSubmit={handleSubmit} className="flex flex-col justify-between space-y-6">
                <div>
                  {errorMsg && (
                    <div className="mb-4 p-3 text-xs bg-red-50 text-red-600 border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {mode === 'signup' && (
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={role === 'provider' ? 'Alex Morgan (Business / Pro Name)' : 'Jordan Smith'}
                        className="w-full border-b border-gray-300 pb-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full border-b border-gray-300 pb-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="relative mb-6">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                      PASSWORD
                    </label>
                    <div className="relative flex items-center border-b border-gray-300 focus-within:border-black transition-colors">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pb-2 text-sm text-black placeholder-gray-400 focus:outline-none pr-8 bg-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 bottom-2 text-black hover:opacity-70 transition-opacity"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 text-xs font-bold tracking-widest uppercase transition-colors duration-200 mt-2 flex items-center justify-center gap-2 ${
                    email && password
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-[#f2f2f2] text-gray-400 cursor-pointer hover:bg-black hover:text-white'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    `CONTINUE AS ${role === 'provider' ? 'PROVIDER' : 'CUSTOMER'}`
                  )}
                </button>
              </form>

              {/* Middle Vertical Divider */}
              <div className="relative flex md:flex-col items-center justify-center my-4 md:my-0">
                <div className="w-full md:w-px h-px md:h-full bg-gray-200" />
                <span className="absolute bg-white px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  OR
                </span>
              </div>

              {/* Right Column: Social Login Buttons */}
              <div className="flex flex-col justify-center space-y-3.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full border border-black bg-white py-3.5 px-5 text-xs font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center relative"
                >
                  <svg className="h-4 w-4 absolute left-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="w-full text-center pl-4">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Apple')}
                  className="w-full border border-black bg-white py-3.5 px-5 text-xs font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center relative"
                >
                  <svg className="h-4 w-4 absolute left-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.05-.96.04-2.12.64-2.81 1.44-.61.71-1.15 1.86-1.01 2.97 1.08.08 2.17-.56 2.83-1.36z" />
                  </svg>
                  <span className="w-full text-center pl-4">Continue with Apple</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="w-full border border-black bg-white py-3.5 px-5 text-xs font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center relative"
                >
                  <svg className="h-4 w-4 absolute left-5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="w-full text-center pl-4">Continue with Facebook</span>
                </button>
              </div>

            </div>

            {/* Bottom Link: CAN'T LOG IN? */}
            <div className="mt-16 text-center">
              <button
                type="button"
                onClick={() => {
                  setForgotOpen(true);
                  setErrorMsg('');
                }}
                className="text-[11px] font-bold tracking-widest text-black hover:opacity-60 uppercase transition-opacity"
              >
                CAN&apos;T LOG IN?
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Bottom Spacing */}
      <footer className="w-full py-6 text-center text-[10px] text-gray-400 uppercase tracking-widest">
        Worksy Marketplace © {new Date().getFullYear()}
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f7f6f2]"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
