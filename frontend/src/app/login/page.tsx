'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { login } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        // If first login, let's take them to onboarding
        if (email.includes('new')) {
          router.push('/onboarding');
        } else {
          router.push('/');
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    await login('priya@example.com', 'password');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050816]">
      {/* Background glow points */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-[100px] animate-pulse"></div>

      <div className="w-full max-w-md glass-card p-8 rounded-[32px] bg-[#0c0f24]/85 border-indigo-950/70 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] mb-3">
            C
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
            CampusPrep AI
          </h2>
          <p className="text-slate-400 text-xs mt-1">Unlock your university syllabus potential</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-email-input"
                type="email"
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-indigo-950/80 rounded-2xl focus:outline-none focus:border-purple-500 text-sm placeholder-slate-600 text-slate-200 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <Link href="/forgot" className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-indigo-950/80 rounded-2xl focus:outline-none focus:border-purple-500 text-sm placeholder-slate-600 text-slate-200 transition-all"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-2xl font-bold text-sm text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-indigo-950/40"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-[#0c0f24] px-3 text-slate-500">Or continue with</span></div>
        </div>

        <button
          id="google-login-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-950/60 rounded-2xl font-semibold text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          {/* Simple Google G Icon Mock */}
          <span className="w-4 h-4 bg-white rounded-full text-black font-extrabold text-[10px] flex items-center justify-center shrink-0">G</span>
          <span>Google Login</span>
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
