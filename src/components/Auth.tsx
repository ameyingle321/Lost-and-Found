import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock } from 'lucide-react';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Registration successful! Please check your email for the verification link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert('Login successful!');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-8 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Subtle background glow inside the card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple/20 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="mb-8 text-center relative">
          <h2 className="text-3xl font-bold bg-claro-gradient bg-clip-text text-transparent mb-2">
            Campus Lost & Found
          </h2>
          <p className="text-white/60 text-sm">
            {isSignUp ? 'Create a secure account to log items and claim property.' : 'Sign in to access your secure campus feed.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-5 relative">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-2 w-full bg-claro-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity rounded-xl py-3 text-sm font-semibold text-white shadow-lg shadow-purple/20 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignUp ? 'Creating Account...' : 'Authenticating...'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center relative border-t border-white/5 pt-6">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>

      </div>
    </div>
  );
}
