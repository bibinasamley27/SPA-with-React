import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-transparent border-t border-zinc-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <p className="text-xs text-zinc-500 font-sans">
          &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
        <p className="text-xs text-zinc-600 font-sans">
          Designed with extreme precision for secure enterprise operations.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
