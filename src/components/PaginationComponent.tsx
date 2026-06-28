import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationData } from '../types';

interface PaginationComponentProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const startTaskIndex = (page - 1) * limit + 1;
  const endTaskIndex = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1 border-t border-zinc-150 dark:border-zinc-800/80 mt-6">
      {/* Informative Stats */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
        Showing <span className="font-semibold text-zinc-850 dark:text-zinc-200">{startTaskIndex}</span> to{' '}
        <span className="font-semibold text-zinc-850 dark:text-zinc-200">{endTaskIndex}</span> of{' '}
        <span className="font-semibold text-zinc-850 dark:text-zinc-200">{total}</span> tasks
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous page trigger */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`h-8 w-8 flex items-center justify-center text-xs font-semibold font-sans rounded-lg transition-all cursor-pointer ${
              page === num
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next page trigger */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
export { PaginationComponent };
