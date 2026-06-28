import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import {
  ListTodo,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  ChevronRight,
  Layers,
  Calendar,
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

const Dashboard: React.FC = () => {
  const { stats, tasks, loading, statsLoading, fetchStats, fetchTasks, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    // Load top 5 recent tasks
    fetchTasks({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
  }, [fetchStats, fetchTasks]);

  const handleStatusToggle = async (id: string, currentStatus: 'pending' | 'completed') => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(id, { status: nextStatus });
    fetchStats();
    fetchTasks({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const priorityColors = {
    high: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/25 border-rose-100 dark:border-rose-900/30',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900/30',
    low: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/25 border-blue-100 dark:border-blue-900/30',
  };

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* Welcome Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-normal text-white font-serif">
            {getGreeting()}, <span className="italic">{user?.name || 'Architect'}</span>
          </h1>
          <p className="mt-1.5 text-xs text-zinc-500 font-sans">
            Here is your enterprise task overview for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/tasks"
            className="flex items-center justify-center gap-1 px-4 h-9 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            All Tasks
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/create"
            className="flex items-center justify-center gap-1.5 px-4 h-9 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Link>
        </div>
      </div>

      {/* Stats Cards Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-sans block mb-2">
              Total Tasks
            </span>
            {statsLoading ? (
              <div className="h-9 w-12 bg-zinc-800 animate-pulse rounded-lg mt-2" />
            ) : (
              <span className="text-4xl font-light text-white font-serif block mt-1.5">
                {stats?.totalTasks || 0}
              </span>
            )}
          </div>
          <div className="absolute right-4 bottom-4 text-zinc-700">
            <ListTodo className="w-5 h-5 text-zinc-600" />
          </div>
        </div>

        {/* Card 2: Completed */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-sans block mb-2">
              Completed
            </span>
            {statsLoading ? (
              <div className="h-9 w-12 bg-zinc-800 animate-pulse rounded-lg mt-2" />
            ) : (
              <span className="text-4xl font-light text-emerald-400 font-serif block mt-1.5">
                {stats?.completedTasks || 0}
              </span>
            )}
          </div>
          <div className="absolute right-4 bottom-4 text-emerald-950/40">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-sans block mb-2">
              Pending
            </span>
            {statsLoading ? (
              <div className="h-9 w-12 bg-zinc-800 animate-pulse rounded-lg mt-2" />
            ) : (
              <span className="text-4xl font-light text-amber-400 font-serif block mt-1.5">
                {stats?.pendingTasks || 0}
              </span>
            )}
          </div>
          <div className="absolute right-4 bottom-4 text-amber-950/40">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        {/* Card 4: Urgent/High */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-sans block mb-2">
              Urgent/High
            </span>
            {statsLoading ? (
              <div className="h-9 w-12 bg-zinc-800 animate-pulse rounded-lg mt-2" />
            ) : (
              <span className="text-4xl font-light text-rose-400 font-serif block mt-1.5">
                {stats?.highPriorityTasks || 0}
              </span>
            )}
          </div>
          <div className="absolute right-4 bottom-4 text-rose-950/40">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activities / Visual summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (Span 2): Recent Tasks list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans">
              Recent Tasks
            </h3>
            {tasks.length > 0 && (
              <Link
                to="/tasks"
                className="text-xs font-semibold text-zinc-500 hover:text-white flex items-center gap-0.5 transition-colors"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 glass-card rounded-2xl p-5 flex flex-col justify-between animate-pulse"
                >
                  <div className="h-4 bg-zinc-800 rounded-md w-1/3" />
                  <div className="h-3 bg-zinc-800 rounded-md w-1/2" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="No recent tasks"
              message="Create a new task to organize your workspace schedule."
              actionLabel="Add First Task"
              onAction={() => navigate('/create')}
            />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between p-4 glass-card rounded-2xl hover:border-zinc-700 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => handleStatusToggle(task.id, task.status)}
                      className="text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white fill-white" />
                      ) : (
                        <Layers className="w-5 h-5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <Link
                        to={`/tasks/${task.id}`}
                        className={`text-sm font-medium text-zinc-100 hover:underline truncate block ${
                          task.status === 'completed' ? 'line-through text-zinc-500' : ''
                        }`}
                      >
                        {task.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-medium font-sans">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" />
                          Due {task.dueDate}
                        </span>
                        <span>•</span>
                        <span
                          className={`uppercase font-bold tracking-wider ${
                            task.priority === 'high'
                              ? 'text-rose-400'
                              : task.priority === 'medium'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/tasks/${task.id}`}
                    className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-550 hover:text-white transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Productivity metrics / Advice panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans px-2">
            Overview Metrics
          </h3>
          <div className="glass-card p-5 rounded-2xl space-y-5">
            {/* Visual Task ratio bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-450 font-sans">
                <span>Completion Rate</span>
                <span className="text-white">
                  {stats && stats.totalTasks > 0
                    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats && stats.totalTasks > 0
                        ? (stats.completedTasks / stats.totalTasks) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Micro stats review */}
            <div className="pt-2 border-t border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-sans">
                <span>Total tasks cataloged</span>
                <span className="font-semibold text-zinc-300">
                  {stats?.totalTasks || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 font-sans">
                <span>Incompleted operations</span>
                <span className="font-semibold text-zinc-300">
                  {stats?.pendingTasks || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 font-sans">
                <span>High focus urgencies</span>
                <span className="font-semibold text-zinc-300">
                  {stats?.highPriorityTasks || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
export { Dashboard };
