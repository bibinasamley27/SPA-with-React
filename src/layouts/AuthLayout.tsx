import React from 'react';
import { CheckSquare } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#050505] text-[#E5E5E5]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Animated Brand Identity */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-xl mb-4 text-black">
          <CheckSquare className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-medium tracking-tight text-white font-serif">
          TaskFlow<span className="text-zinc-500">.</span>
        </h2>
        <p className="mt-1.5 text-xs text-zinc-500 font-sans">
          Secure, enterprise-level orchestration for all your objectives.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
export { AuthLayout };
