import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  id?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', message, id }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div id={id || 'app-loader'} className="flex flex-col items-center justify-center p-6 text-center">
      <div
        className={`${sizeClasses[size]} border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100 rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 font-sans animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
export { Loader };
