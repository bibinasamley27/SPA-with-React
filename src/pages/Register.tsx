import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation States
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!name.trim()) {
      setNameError('Full name is required');
      isValid = false;
    }

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

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // AuthContext handles display of toast notifications
    }
  };

  return (
    <div id="register-container">
      <h3 className="text-2xl font-medium text-white text-center font-serif">
        Create an enterprise account
      </h3>
      <p className="mt-2 text-center text-xs text-zinc-400 font-sans">
        Or{' '}
        <Link
          to="/login"
          className="font-semibold text-white hover:underline transition-all"
        >
          sign in to your existing account
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Full Name Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
              <UserIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="Alexander Wright"
              className={`w-full h-10 pl-9 pr-4 bg-zinc-950/60 border ${
                nameError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600'
              } text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all`}
            />
          </div>
          {nameError && (
            <p className="text-[11px] font-semibold text-rose-500 font-sans mt-0.5">{nameError}</p>
          )}
        </div>

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
                  ? 'border-rose-500 focus:border-rose-500'
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
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
            Password (min. 6 characters)
          </label>
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
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600'
              } text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-550 hover:text-zinc-350 transition-colors"
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

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              placeholder="••••••••"
              className={`w-full h-10 pl-9 pr-10 bg-zinc-950/60 border ${
                confirmPasswordError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600'
              } text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all`}
            />
          </div>
          {confirmPasswordError && (
            <p className="text-[11px] font-semibold text-rose-500 font-sans mt-0.5">
              {confirmPasswordError}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pt-0.5"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Register Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
export { Register };
