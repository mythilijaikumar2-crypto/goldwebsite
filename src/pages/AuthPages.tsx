import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEO } from '../components/common/SEO';

// Schemas
const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = zod.object({
  name: zod.string().min(3, 'Name must be at least 3 characters'),
  email: zod.string().email('Please enter a valid email address'),
  phone: zod.string().min(8, 'Please enter a valid phone number'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

const forgotSchema = zod.object({
  email: zod.string().email('Please enter a valid email address')
});

const otpSchema = zod.object({
  otp: zod.string().length(6, 'OTP must be exactly 6 digits')
});

/* ==========================================================================
   1. LOGIN COMPONENT
   ========================================================================== */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setErrorMsg('');
    try {
      await login(data.email);
      navigate('/profile');
    } catch (e) {
      setErrorMsg('Invalid credentials. Please verify your email.');
    }
  };

  return (
    <>
      <SEO title="Account Login" description="Log into JKS Jewels to manage your orders, saved addresses, settings, and personal wishlist." />
      <div className="grow max-w-md mx-auto px-4 w-full py-16 text-left select-none">
        <Breadcrumbs items={[{ label: 'Login' }]} />
        <div className="bg-luxury-surface border border-gold-primary/10 rounded p-8 mt-4 shadow-2xl">
          <h2 className="font-heading text-xl text-gold-light uppercase tracking-wider mb-2">Welcome Back</h2>
          <p className="font-luxury italic text-xs text-neutral-400 mb-6">Enter your credentials to access the Atelier.</p>
          
          {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded mb-4">{errorMsg}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs font-body">
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500">Email Address</label>
              <div className="relative">
                <input type="email" {...register('email')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 pl-10 text-white outline-none" />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
              {errors.email && <span className="text-[10px] text-red-500">{errors.email.message as string}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-neutral-500">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-gold-primary hover:text-gold-light">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input type="password" {...register('password')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 pl-10 text-white outline-none" />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
              {errors.password && <span className="text-[10px] text-red-500">{errors.password.message as string}</span>}
            </div>

            <button type="submit" className="w-full bg-gold-primary text-black font-semibold font-body py-3.5 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer">
              Login to Account
            </button>
          </form>

          <p className="text-[10px] text-neutral-500 text-center mt-6">
            Don't have an account? <Link to="/register" className="text-gold-primary hover:text-gold-light font-bold">Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   2. REGISTER COMPONENT
   ========================================================================== */
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: any) => {
    setErrorMsg('');
    try {
      await authRegister(data.name, data.email, data.phone);
      navigate('/verify-otp?email=' + encodeURIComponent(data.email));
    } catch (e) {
      setErrorMsg('Registration failed. Email might already exist.');
    }
  };

  return (
    <>
      <SEO title="Create Account" description="Register a personal account with JKS Jewels to secure private viewings, tailored bridal sets, and lifetime buyback warranties." />
      <div className="grow max-w-md mx-auto px-4 w-full py-12 text-left select-none">
        <Breadcrumbs items={[{ label: 'Register' }]} />
        <div className="bg-luxury-surface border border-gold-primary/10 rounded p-8 mt-4 shadow-2xl">
          <h2 className="font-heading text-xl text-gold-light uppercase tracking-wider mb-2">Create Account</h2>
          <p className="font-luxury italic text-xs text-neutral-400 mb-6">Register to access private member privileges.</p>

          {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded mb-4">{errorMsg}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs font-body">
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500">Full Name</label>
              <div className="relative">
                <input type="text" {...register('name')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 pl-10 text-white outline-none" />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
              {errors.name && <span className="text-[10px] text-red-500">{errors.name.message as string}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500">Email Address</label>
              <div className="relative">
                <input type="email" {...register('email')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 pl-10 text-white outline-none" />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
              {errors.email && <span className="text-[10px] text-red-500">{errors.email.message as string}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500">Phone Contact</label>
              <div className="relative">
                <input type="text" {...register('phone')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 pl-10 text-white outline-none" />
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
              {errors.phone && <span className="text-[10px] text-red-500">{errors.phone.message as string}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500">Password</label>
              <div className="relative">
                <input type="password" {...register('password')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 pl-10 text-white outline-none" />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
              {errors.password && <span className="text-[10px] text-red-500">{errors.password.message as string}</span>}
            </div>

            <button type="submit" className="w-full bg-gold-primary text-black font-semibold font-body py-3.5 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer">
              Register Account
            </button>
          </form>

          <p className="text-[10px] text-neutral-500 text-center mt-6">
            Already have an account? <Link to="/login" className="text-gold-primary hover:text-gold-light font-bold">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   3. FORGOT PASSWORD COMPONENT
   ========================================================================== */
export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { sendOtp } = useAuth();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      await sendOtp(data.email);
      setSuccess(true);
      setTimeout(() => {
        navigate('/verify-otp?email=' + encodeURIComponent(data.email));
      }, 2500);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <SEO title="Recover Password" description="Request a reset link or OTP verification code to recover your JKS Jewels member credentials." />
      <div className="grow max-w-md mx-auto px-4 w-full py-16 text-left select-none">
        <Breadcrumbs items={[{ label: 'Recover Password' }]} />
        <div className="bg-luxury-surface border border-gold-primary/10 rounded p-8 mt-4 shadow-2xl">
          <h2 className="font-heading text-xl text-gold-light uppercase tracking-wider mb-2">Recover Password</h2>
          <p className="font-luxury italic text-xs text-neutral-400 mb-6">Enter your email to receive recovery instructions.</p>

          {success ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0 text-green-400" />
              <span>OTP code sent successfully. Redirecting...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs font-body">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500">Registered Email</label>
                <div className="relative">
                  <input type="email" {...register('email')} className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 pl-10 text-white outline-none" />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                </div>
                {errors.email && <span className="text-[10px] text-red-500">{errors.email.message as string}</span>}
              </div>

              <button type="submit" className="w-full bg-gold-primary text-black font-semibold font-body py-3.5 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer">
                Send Recovery OTP
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link to="/login" className="text-[10px] text-neutral-500 hover:text-gold-primary transition uppercase tracking-widest font-body">Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
   4. OTP VERIFICATION COMPONENT
   ========================================================================== */
export const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get('email') || 'your email';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(otpSchema)
  });

  const onSubmit = (data: any) => {
    setErrorMsg('');
    // Mock OTP verification - logs details to developer console
    console.log(`[JKS Jewels] Checking verification OTP: ${data.otp}`);
    setSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  return (
    <>
      <SEO title="OTP Verification" description="Submit your 6-digit one-time PIN to authenticate access into JKS Jewels luxury profile registry." />
      <div className="grow max-w-md mx-auto px-4 w-full py-16 text-left select-none">
        <Breadcrumbs items={[{ label: 'OTP Verification' }]} />
        <div className="bg-luxury-surface border border-gold-primary/10 rounded p-8 mt-4 shadow-2xl">
          <h2 className="font-heading text-xl text-gold-light uppercase tracking-wider mb-2">OTP Verification</h2>
          <p className="font-luxury italic text-xs text-neutral-400 mb-6">A 6-digit code has been dispatched to {email}. Check console for simulated OTP code.</p>

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0 text-green-400" />
              <span>Identity Verified. Logging in...</span>
            </div>
          )}

          {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded mb-4">{errorMsg}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs font-body">
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500">6-Digit PIN</label>
              <input 
                type="text" 
                maxLength={6}
                placeholder="123456"
                {...register('otp')} 
                className="w-full bg-luxury-bg border border-gold-primary/20 focus:border-gold-primary rounded p-3 text-center text-lg font-bold tracking-widest text-white outline-none" 
              />
              {errors.otp && <span className="text-[10px] text-red-500">{errors.otp.message as string}</span>}
            </div>

            <button type="submit" className="w-full bg-gold-primary text-black font-semibold font-body py-3.5 rounded hover:bg-gold-light transition uppercase tracking-widest mt-2 cursor-pointer">
              Verify OTP Code
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
