import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortDropdownProps {
  sortBy: string;
  onSortByChange: (field: string) => void;
  sortOrder: string;
  onSortOrderChange: (order: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const toggleOrder = () => {
    onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="flex flex-wrap items-end gap-2.5">
      {/* Sort By Field */}
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider font-sans">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-sans rounded-xl text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-550 transition-all shadow-sm cursor-pointer"
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Direction Toggle Trigger */}
      <button
        onClick={toggleOrder}
        className="h-10 w-10 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-300 transition-colors shadow-sm cursor-pointer"
        title={sortOrder === 'desc' ? 'Sorting Descending' : 'Sorting Ascending'}
      >
        {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SortDropdown;
export { SortDropdown };
