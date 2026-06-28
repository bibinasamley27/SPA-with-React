import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MoveLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-center select-none" id="not-found-container">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-md mb-6 animate-bounce">
        <Compass className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
      </div>
      <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
        404
      </h1>
      <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 font-sans mt-2">
        Page Not Found
      </h2>
      <p className="mt-2 text-sm text-zinc-450 dark:text-zinc-400 font-sans max-w-sm leading-relaxed mx-auto">
        The task catalog or interface you are requesting does not exist, or has been moved to a different workspace.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1.5 px-5 h-10 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-all shadow-md"
      >
        <MoveLeft className="w-4 h-4" />
        Return to Workspace
      </Link>
    </div>
  );
};

export default NotFound;
export { NotFound };
