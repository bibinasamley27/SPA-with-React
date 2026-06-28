import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import SearchBar from '../components/SearchBar';
import FilterComponent from '../components/FilterComponent';
import SortDropdown from '../components/SortDropdown';
import PaginationComponent from '../components/PaginationComponent';
import TaskCard from '../components/TaskCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { Plus, SlidersHorizontal, X } from 'lucide-react';

const AllTasks: React.FC = () => {
  const { tasks, pagination, loading, fetchTasks, updateTask, deleteTask } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL state sync
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const priority = searchParams.get('priority') || 'all';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  // Toggle Filters Visibility
  const [showFilters, setShowFilters] = useState(false);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState<Task | null>(null);

  // Search input debouncer trigger or quick update
  const [searchQuery, setSearchQuery] = useState(search);

  // Fetch tasks when params change
  useEffect(() => {
    fetchTasks({
      page,
      limit,
      search,
      status,
      priority,
      sortBy,
      sortOrder,
    });
  }, [fetchTasks, page, limit, search, status, priority, sortBy, sortOrder]);

  // Sync state for local query search
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  // Handle parameter updating in address bar
  const updateQueryParam = useCallback((updates: Record<string, string | number | undefined>) => {
    const nextParams = new URLSearchParams(searchParams);
    
    // Always reset page to 1 when filters or search change
    if (!('page' in updates)) {
      nextParams.set('page', '1');
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === 'all' || value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  // Debounced/delayed search dispatch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== search) {
        updateQueryParam({ search: searchQuery, page: 1 });
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, search, updateQueryParam]);

  const handleStatusToggle = async (id: string, currentStatus: 'pending' | 'completed') => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(id, { status: nextStatus });
  };

  const handleDeleteTrigger = (task: Task) => {
    setSelectedTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTaskToDelete) {
      await deleteTask(selectedTaskToDelete.id);
      setSelectedTaskToDelete(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = search || status !== 'all' || priority !== 'all';

  return (
    <div className="space-y-6" id="all-tasks-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-3xl font-normal text-white font-serif">
            Comprehensive Task List
          </h2>
          <p className="mt-1.5 text-xs text-zinc-500 font-sans">
            Apply sorting, filter queries, or create and delete tasks cleanly.
          </p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center justify-center gap-1.5 px-4 h-9 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Control Tools bar */}
      <div className="glass-card p-4 rounded-2xl space-y-4">
        {/* Row 1: Search & Filter Toggles */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold font-sans border transition-all cursor-pointer ${
                showFilters || hasActiveFilters
                  ? 'bg-white border-white text-black'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters ? 'Filters Active' : 'Filter & Sort'}
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 h-10 px-3 hover:bg-zinc-900 rounded-xl text-xs font-semibold text-rose-450 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Detailed Filters and Sorting Options (collapsible) */}
        {(showFilters || hasActiveFilters) && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap gap-x-6 gap-y-4">
            <FilterComponent
              statusValue={status}
              onStatusChange={(v) => updateQueryParam({ status: v })}
              priorityValue={priority}
              onPriorityChange={(v) => updateQueryParam({ priority: v })}
            />
            <SortDropdown
              sortBy={sortBy}
              onSortByChange={(v) => updateQueryParam({ sortBy: v })}
              sortOrder={sortOrder}
              onSortOrderChange={(v) => updateQueryParam({ sortOrder: v })}
            />
          </div>
        )}
      </div>

      {/* Task List Render Stage */}
      {loading ? (
        <div className="py-14">
          <Loader size="medium" message="Refreshing tasks..." />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No search results' : 'No tasks assigned'}
          message={
            hasActiveFilters
              ? 'Try modifying your search query filters to fetch match catalogs.'
              : 'Add tasks using the creation portal to organize your enterprise agenda.'
          }
          actionLabel={hasActiveFilters ? 'Clear Queries' : 'Add First Task'}
          onAction={hasActiveFilters ? handleClearFilters : () => navigate('/create')}
        />
      ) : (
        <div className="space-y-3.5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusToggle={handleStatusToggle}
              onDeleteClick={handleDeleteTrigger}
            />
          ))}

          {/* Pagination Controls */}
          {pagination && (
            <PaginationComponent
              pagination={pagination}
              onPageChange={(p) => updateQueryParam({ page: p })}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={selectedTaskToDelete?.title || ''}
      />
    </div>
  );
};

export default AllTasks;
export { AllTasks };
