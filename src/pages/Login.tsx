import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check if redirected due to token expiration
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('expired') === 'true') {
      info('Session Expired', 'Your session has timed out. Please sign in again.');
    }
  }, [location, info]);

  // Client-side quick validators
  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(email, password);
      // Retrieve redirect route, default to dashboard
      const origin = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    } catch (err) {
      // Toast notification is automatically managed inside AuthContext
    }
  };

  return (
    <div id="login-container">
      <h3 className="text-2xl font-medium text-white text-center font-serif">
        Sign in to your account
      </h3>
      <p className="mt-2 text-center text-xs text-zinc-400 font-sans">
        Or{' '}
        <Link
          to="/register"
          className="font-semibold text-white hover:underline transition-all"
        >
          register a new enterprise account
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              placeholder="name@example.com"
              className={`w-full h-10 pl-9 pr-4 bg-zinc-950/60 border ${
                emailError
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600'
              } text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all`}
            />
          </div>
          {emailError && (
            <p className="text-[11px] font-semibold text-rose-500 font-sans mt-0.5">{emailError}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
              Password
            </label>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              placeholder="••••••••"
              className={`w-full h-10 pl-9 pr-10 bg-zinc-950/60 border ${
                passwordError
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600'
              } text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-350 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-[11px] font-semibold text-rose-500 font-sans mt-0.5">
              {passwordError}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
export { Login };
