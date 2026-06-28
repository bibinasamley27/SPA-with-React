import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { ChevronLeft, Save, Loader2, Calendar } from 'lucide-react';

const CreateTask: React.FC = () => {
  const { createTask, loading } = useTasks();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(() => {
    // Default to 3 days from now
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  });

  // Validation
  const [titleError, setTitleError] = useState('');

  const validateForm = () => {
    setTitleError('');
    if (!title.trim()) {
      setTitleError('Task title is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createTask(title, description, priority, dueDate);
      navigate('/tasks');
    } catch (err) {
      // Toast notification is managed inside context
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6" id="create-task-container">
      {/* Back CTA */}
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to tasks
        </Link>
      </div>

      {/* Main card panel */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-normal text-white font-serif">
            Create New Task
          </h2>
          <p className="mt-1.5 text-xs text-zinc-500 font-sans">
            Add detailed instructions, priorities, and schedules.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              placeholder="e.g., Finalize security logs"
              className={`w-full h-10 px-3 bg-zinc-950/60 border ${
                titleError ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600'
              } text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all`}
            />
            {titleError && (
              <p className="text-[11px] font-semibold text-rose-500 font-sans mt-0.5">{titleError}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive breakdown of the operations required for this task."
              rows={4}
              className="w-full p-3 bg-zinc-950/60 border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600 text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all resize-y min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950/60 border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600 text-sm font-sans rounded-xl text-white focus:outline-none focus:ring-1 transition-all cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* Due date picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-950/60 border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600 text-sm font-sans rounded-xl text-white focus:outline-none focus:ring-1 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
            <Link
              to="/tasks"
              className="px-4 h-9 flex items-center justify-center border border-zinc-800 text-zinc-300 hover:bg-zinc-900 text-sm font-semibold rounded-lg transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 h-9 flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-sm font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
export { CreateTask };
