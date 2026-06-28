import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, CheckSquare, User as UserIcon, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/40 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <CheckSquare className="w-4.5 h-4.5 text-black" />
          </div>
          <span className="font-serif font-medium tracking-tight text-lg text-white">
            TaskFlow.
          </span>
        </Link>

        {/* Action Controls */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            {/* Quick Create Button */}
            <Link
              to="/create"
              className="hidden sm:flex items-center gap-1.5 px-4 h-9 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              New Task
            </Link>

            {/* Profile badge */}
            <div className="flex items-center gap-2.5 py-1 pl-1.5 pr-2.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-semibold text-[11px] text-zinc-350 uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:inline text-xs font-medium text-zinc-300">
                {user.name}
              </span>
            </div>

            {/* Logout Trigger */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 h-9 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-all flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
