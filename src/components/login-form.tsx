'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const { login, isLoading, error } = useAuth();
  const [userCode, setUserCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!userCode.trim() || !password.trim()) {
      setFormError('Please enter both username and password.');
      return;
    }

    try {
      await login({ userCode, password });
    } catch (err) {
      // Error handled by context state
    }
  };

  return (
    <div className={cn('w-full max-w-sm mx-auto', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div className="space-y-2">
          <label htmlFor="userCode" className="text-sm font-medium text-muted-foreground ml-1">
            Username or Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <User className="h-5 w-5" />
            </div>
            <input
              id="userCode"
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm placeholder:text-muted-foreground/60"
              placeholder="Enter your username"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-muted-foreground ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-10 py-3 bg-muted/40 border border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm placeholder:text-muted-foreground/60"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-4 w-4 rounded border border-white/20 bg-muted/40 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Remember Me
            </span>
          </label>
          <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
            Forgot password?
          </a>
        </div>

        {/* Error Message */}
        {(error || formError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
            {error || formError}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 p-px focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-[11px] bg-gradient-to-br from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all group-hover:bg-opacity-90">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Login to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </div>
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        New to the system?{' '}
        <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Request Access
        </a>
      </div>
    </div>
  );
}
