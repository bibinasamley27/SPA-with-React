import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { ChevronLeft, Calendar, Trash2, Edit3, CheckCircle2, Circle, AlertCircle, Clock, Undo } from 'lucide-react';
import Loader from '../components/Loader';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ViewTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTask, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Delete modal triggers
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id) return;
      try {
        const data = await getTask(id);
        setTask(data);
      } catch (err) {
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, getTask, navigate]);

  const handleStatusToggle = async () => {
    if (!task) return;
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task.id, { status: nextStatus });
      setTask({ ...task, status: nextStatus, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (task) {
      await deleteTask(task.id);
      navigate('/tasks');
    }
  };

  const priorityColors = {
    high: {
      bg: 'bg-rose-950/20',
      text: 'text-rose-400',
      border: 'border-rose-900/30',
    },
    medium: {
      bg: 'bg-amber-950/20',
      text: 'text-amber-400',
      border: 'border-amber-900/30',
    },
    low: {
      bg: 'bg-emerald-950/20',
      text: 'text-emerald-400',
      border: 'border-emerald-900/30',
    },
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader size="medium" message="Fetching task documentation..." />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20 text-zinc-500 font-sans">
        Record not found or access denied.
      </div>
    );
  }

  const colors = priorityColors[task.priority] || priorityColors.medium;
  const isCompleted = task.status === 'completed';

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="view-task-container">
      {/* Back CTA */}
      <div className="flex items-center justify-between pb-2">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to tasks
        </Link>
        <Link
          to={`/tasks/${task.id}/edit`}
          className="inline-flex items-center gap-1.5 px-3 h-9 text-xs font-semibold border border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-lg transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Task
        </Link>
      </div>

      {/* Main details block */}
      <div className="glass-card rounded-2xl p-6 space-y-6 overflow-hidden">
        {/* Title and badges row */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {task.priority} Priority
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase ${
                isCompleted
                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
                  : 'bg-amber-950/20 text-amber-400 border-amber-900/30'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  Pending Action
                </>
              )}
            </span>
          </div>

          <h1
            className={`text-3xl font-normal text-white font-serif leading-tight ${
              isCompleted ? 'line-through text-zinc-500' : ''
            }`}
          >
            {task.title}
          </h1>
        </div>

        {/* Detailed description */}
        <div className="py-4 border-t border-b border-zinc-800">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans mb-2.5">
            Details Scope
          </h3>
          <p className="text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
            {task.description || 'No description provided for this task record.'}
          </p>
        </div>

        {/* Timestamps & Scheduling Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
              Execution Deadline
            </span>
            <span className="text-xs font-semibold text-zinc-250 font-sans flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-zinc-500" />
              {formatDate(task.dueDate).split(' at')[0]} {/* Simple date extraction */}
            </span>
          </div>

          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
              Creation Details
            </span>
            <span className="text-xs font-medium text-zinc-400 font-sans block">
              Created: {formatDate(task.createdAt)}
            </span>
            {task.updatedAt !== task.createdAt && (
              <span className="text-[11px] text-zinc-500 font-sans block">
                Last modified: {formatDate(task.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800">
          <button
            onClick={handleStatusToggle}
            className={`px-4 h-9 flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isCompleted
                ? 'border border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                : 'bg-white hover:bg-zinc-200 text-black'
            }`}
          >
            {isCompleted ? (
              <>
                <Undo className="w-4 h-4" />
                Re-open Task
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Mark as Completed
              </>
            )}
          </button>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="px-4 h-9 flex items-center justify-center gap-1.5 border border-rose-900/35 hover:bg-rose-950/20 text-rose-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task Permanently
          </button>
        </div>
      </div>

      {/* Confirmation triggers */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />
    </div>
  );
};

export default ViewTask;
export { ViewTask };
