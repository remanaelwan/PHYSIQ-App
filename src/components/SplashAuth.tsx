import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ChevronRight, Apple } from 'lucide-react';
import { soundManager } from '../lib/soundManager';

interface SplashAuthProps {
  onAuthenticate?: (email: string, isNewUser: boolean) => void;
  onComplete?: () => void;
}

export const SplashAuth: React.FC<SplashAuthProps> = ({ onAuthenticate, onComplete }) => {
  const [isSplash, setIsSplash] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('ahmed.physiq@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleAuth = (userEmail: string, newUser: boolean) => {
    if (newUser) {
      soundManager.play('account_created');
    } else {
      soundManager.play('login_success');
    }
    if (onAuthenticate) {
      onAuthenticate(userEmail, newUser);
    }
    if (onComplete) {
      onComplete();
    }
  };

  // Auto transition from splash after 2.2s
  React.useEffect(() => {
    soundManager.play('splash_reveal');
    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(email, isSignUp);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04060c] text-white flex flex-col justify-between items-center p-6 overflow-hidden select-none">
      {/* Background Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Splash Animation Overlay */}
      <AnimatePresence>
        {isSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 bg-[#04060c] flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative w-36 h-36 mb-6 flex items-center justify-center"
            >
              {/* Logo SVG Icon */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 blur-2xl animate-pulse" />
              <svg viewBox="0 0 120 120" className="w-32 h-32 z-10 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                {/* Silver P Background Outline */}
                <path
                  d="M25,20 H65 C85,20 95,32 95,50 C95,68 85,80 65,80 H45 V100 H25 Z"
                  fill="none"
                  stroke="url(#silverGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Torso & Spine Dots */}
                <path
                  d="M45,35 Q55,45 60,38 Q65,45 75,35 M50,50 C60,55 60,65 50,75 M70,50 C60,55 60,65 70,75"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="38" r="3" fill="#00d2ff" className="animate-ping" />
                <circle cx="58" cy="48" r="3" fill="#00d2ff" />
                <circle cx="56" cy="58" r="3" fill="#00d2ff" />
                <circle cx="54" cy="68" r="3" fill="#00d2ff" />
                <defs>
                  <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
            >
              PHYSIQ
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold mt-2"
            >
              KNOW YOUR BODY. ELEVATE YOURSELF.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Authentication Content */}
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center pt-8 pb-4">
        {/* PhysIQ Brand Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-6"
        >
          <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-xl" />
            <svg viewBox="0 0 120 120" className="w-20 h-20 drop-shadow-[0_0_20px_rgba(0,210,255,0.5)]">
              <path
                d="M25,20 H65 C85,20 95,32 95,50 C95,68 85,80 65,80 H45 V100 H25 Z"
                fill="none"
                stroke="url(#silverGradientAuth)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M45,35 Q55,45 60,38 Q65,45 75,35 M50,50 C60,55 60,65 50,75 M70,50 C60,55 60,65 70,75"
                fill="none"
                stroke="#00d2ff"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="60" cy="38" r="3" fill="#00d2ff" />
              <circle cx="58" cy="48" r="3" fill="#00d2ff" />
              <circle cx="56" cy="58" r="3" fill="#00d2ff" />
              <circle cx="54" cy="68" r="3" fill="#00d2ff" />
              <defs>
                <linearGradient id="silverGradientAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            PHYSIQ
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-1">
            KNOW YOUR BODY. ELEVATE YOURSELF.
          </p>
        </motion.div>

        {/* Auth Title */}
        <div className="w-full text-left mb-6">
          <h3 className="text-2xl font-bold text-white">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {isSignUp ? 'Start your AI fitness & recovery journey' : 'Sign in to continue your journey'}
          </p>
        </div>

        {/* Social SSO Buttons */}
        <div className="w-full space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleAuth(email, isSignUp)}
            className="w-full h-12 rounded-xl glass-panel flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-white/10 active:scale-[0.98] transition-all border border-white/15 shadow-lg"
          >
            <Apple className="w-5 h-5 fill-current" />
            Continue with Apple
          </button>

          <button
            type="button"
            onClick={() => handleAuth(email, isSignUp)}
            className="w-full h-12 rounded-xl glass-panel flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-white/10 active:scale-[0.98] transition-all border border-white/15 shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* OR Divider */}
        <div className="w-full flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-slate-800" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">OR</span>
          <div className="flex-1 h-[1px] bg-slate-800" />
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-12 pl-12 pr-12 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isSignUp && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_rgba(59,130,246,0.8)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-1"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-[11px] text-slate-500 leading-relaxed px-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            By continuing, you agree to our{' '}
            <span className="text-blue-400 underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-blue-400 underline cursor-pointer">Privacy Policy</span>
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotPasswordOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/20 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your email address and we will send you a password reset link.
              </p>
              {forgotSent ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs mb-4">
                  Password reset link sent to {email}!
                </div>
              ) : (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 mb-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setForgotSent(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl glass-pill text-xs font-semibold text-slate-300"
                >
                  Close
                </button>
                {!forgotSent && (
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                  >
                    Send Link
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
