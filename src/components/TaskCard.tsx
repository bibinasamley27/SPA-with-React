import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types';
import { Calendar, Trash2, Edit3, Circle, CheckCircle2, ChevronRight } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusToggle: (id: string, currentStatus: 'pending' | 'completed') => void;
  onDeleteClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusToggle, onDeleteClick }) => {
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

  const colors = priorityColors[task.priority] || priorityColors.medium;

  // Format due date elegantly
  const formatDueDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  const isCompleted = task.status === 'completed';

  return (
    <div
      id={`task-card-${task.id}`}
      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 glass-card rounded-2xl hover:border-zinc-700 transition-all gap-4"
    >
      {/* Task Information & Status Trigger */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <button
          onClick={() => onStatusToggle(task.id, task.status)}
          className="mt-1 flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-white fill-white" />
          ) : (
            <Circle className="w-5 h-5 text-zinc-600 hover:border-zinc-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <h4
              className={`text-sm font-medium text-zinc-100 font-sans truncate ${
                isCompleted ? 'line-through text-zinc-500' : ''
              }`}
            >
              {task.title}
            </h4>

            {/* Priority Indicator */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border uppercase ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {task.priority}
            </span>
          </div>

          {/* Description */}
          <p
            className={`mt-1.5 text-xs text-zinc-400 font-sans line-clamp-2 max-w-2xl leading-relaxed ${
              isCompleted ? 'opacity-50' : ''
            }`}
          >
            {task.description || 'No description provided.'}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-600" />
              Due: {formatDueDate(task.dueDate)}
            </span>
            <span>•</span>
            <span>Created: {formatDueDate(task.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Task Actions */}
      <div className="flex items-center justify-end gap-2 w-full md:w-auto border-t md:border-t-0 border-zinc-800/80 pt-3 md:pt-0">
        {/* View Link */}
        <Link
          to={`/tasks/${task.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-zinc-900 transition-colors"
        >
          Details
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {/* Edit Link */}
        <Link
          to={`/tasks/${task.id}/edit`}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
          title="Edit Task"
        >
          <Edit3 className="w-4 h-4" />
        </Link>

        {/* Delete button */}
        <button
          onClick={() => onDeleteClick(task)}
          className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
          title="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
export { TaskCard };
