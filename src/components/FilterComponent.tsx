import React from 'react';

interface FilterComponentProps {
  statusValue: string;
  onStatusChange: (status: string) => void;
  priorityValue: string;
  onPriorityChange: (priority: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  statusValue,
  onStatusChange,
  priorityValue,
  onPriorityChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter */}
      <div className="flex flex-col gap-1.5 min-w-[130px]">
        <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider font-sans">
          Status
        </label>
        <select
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-sans rounded-xl text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-550 transition-all shadow-sm cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="flex flex-col gap-1.5 min-w-[130px]">
        <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider font-sans">
          Priority
        </label>
        <select
          value={priorityValue}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-sans rounded-xl text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-550 transition-all shadow-sm cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterComponent;
export { FilterComponent };
