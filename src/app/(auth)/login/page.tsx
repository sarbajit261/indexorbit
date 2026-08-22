'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, LogIn, Mail, Lock, ShieldCheck, Loader2, Timer, MapPin, Star, ArrowRight, Zap } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Step = 'email' | 'otp' | 'password';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function handleSendOtp() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'LOGIN' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        setIsLoading(false);
        return;
      }

      setStep('otp');
      setCountdown(60);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    if (countdown > 0) return;
    setIsResending(true);
    await handleSendOtp();
    setIsResending(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, purpose: 'LOGIN' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid code');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        otpVerified: true,
        redirect: false,
      });

      if (result?.error) {
        setError('Failed to sign in. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid password');
        setIsLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a897d] via-[#0d9488] to-[#0a897d] relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center w-full max-w-md mx-auto px-10 xl:px-16 text-white">
          {/* Logo */}
          <Link href="/" className="mb-10">
            <Image
              src="/Main Logo IO.png"
              alt="IndexOrbit"
              width={130}
              height={87}
              className="h-auto w-32 brightness-0 invert drop-shadow-lg"
            />
          </Link>

          {/* Headline */}
          <h1 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
            Welcome back to<br />
            <span className="text-white/90">IndexOrbit</span>
          </h1>

          <p className="text-base text-white/75 mb-10 leading-relaxed">
            Sign in to discover local businesses, save favorites, and get personalized AI-powered recommendations.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {[
              { icon: MapPin, text: 'Find businesses near you' },
              { icon: Star, text: 'Read and write reviews' },
              { icon: Zap, text: 'Get instant recommendations' },
            ].map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['JD', 'MK', 'SR', 'AL', 'PR'].map((initials, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-xs font-medium backdrop-blur-sm">
                    {initials}
                  </div>
                ))}
              </div>
              <div className="text-xs text-white/60">
                <span className="font-semibold text-white">10,000+</span> happy users
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full border border-white/5" />
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-white/5" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/Black Logo IO.png"
                alt="IndexOrbit"
                width={80}
                height={53}
                className="h-auto w-20"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              {step === 'email' && 'Sign in'}
              {step === 'otp' && 'Check your email'}
              {step === 'password' && 'Enter password'}
            </h2>
            <p className="text-base text-muted-foreground mt-1.5">
              {step === 'email' && 'Continue to IndexOrbit'}
              {step === 'otp' && `Code sent to ${email}`}
              {step === 'password' && 'Enter your password to sign in'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-10 bg-muted/40 border-0 rounded-xl focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-sm font-medium" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <>Continue</>
                )}
              </Button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center"><Separator /></div>
                <div className="relative flex justify-center"><span className="bg-background px-3 text-sm text-muted-foreground">or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-10 rounded-xl text-sm" onClick={() => signIn('google', { callbackUrl: '/' })}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-10 rounded-xl text-sm" onClick={() => signIn('facebook', { callbackUrl: '/' })}>
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0a897d]/10 mb-3">
                  <ShieldCheck className="w-7 h-7 text-[#0a897d]" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code we sent to<br />
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <Input
                  id="otp"
                  type="text"
                  placeholder="_ _ _ _ _ _"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-xl tracking-[0.4em] h-12 font-mono rounded-xl"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-muted-foreground text-center">Code expires in 10 minutes</p>
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-sm font-medium" disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  <>Verify Code</>
                )}
              </Button>

              <div className="flex items-center justify-between text-sm pt-1">
                <button type="button" onClick={() => setStep('email')} className="text-muted-foreground hover:text-foreground">
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className={`flex items-center gap-1 ${countdown > 0 ? 'text-muted-foreground' : 'text-[#0a897d] hover:underline'}`}
                >
                  {countdown > 0 ? (
                    <><Timer className="h-3 w-3" /> Resend in {countdown}s</>
                  ) : (
                    'Resend code'
                  )}
                </button>
              </div>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center"><Separator /></div>
                <div className="relative flex justify-center"><span className="bg-background px-3 text-sm text-muted-foreground">or</span></div>
              </div>

              <Button type="button" variant="outline" className="w-full h-10 rounded-xl text-sm" onClick={() => setStep('password')}>
                Use Password Instead
              </Button>
            </form>
          )}

          {/* Step 3: Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="h-11 pl-10 pr-10 bg-muted/40 border-0 rounded-xl focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-[#0a897d] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-sm font-medium" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                ) : (
                  <><LogIn className="mr-2 h-4 w-4" /> Sign In</>
                )}
              </Button>

              <div className="text-center">
                <button type="button" onClick={() => setStep('otp')} className="text-sm text-muted-foreground hover:text-foreground">
                  Use OTP instead
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <p className="text-sm text-muted-foreground text-center mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#0a897d] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
