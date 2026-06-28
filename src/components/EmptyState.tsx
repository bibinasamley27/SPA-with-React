import React from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  message = 'Get started by creating your very first task right now.',
  actionLabel,
  onAction,
  id,
}) => {
  return (
    <div
      id={id || 'tasks-empty-state'}
      className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-14 max-w-lg mx-auto shadow-sm"
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center border border-zinc-250/50 dark:border-zinc-700/50 mb-4">
        <ClipboardList className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-xs leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 h-9 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium rounded-xl shadow-sm transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
