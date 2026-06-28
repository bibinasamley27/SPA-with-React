import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Loader from '../components/Loader';

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTask, updateTask, loading } = useTasks();
  const navigate = useNavigate();

  const [initialLoading, setInitialLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  // Validation
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    const fetchAndPopulateTask = async () => {
      if (!id) return;
      try {
        const task = await getTask(id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate.split('T')[0]); // Ensure split matches simple YYYY-MM-DD formats
      } catch (err) {
        navigate('/tasks');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAndPopulateTask();
  }, [id, getTask, navigate]);

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
    if (!validateForm() || !id) return;

    try {
      await updateTask(id, {
        title,
        description,
        status,
        priority,
        dueDate,
      });
      navigate('/tasks');
    } catch (err) {
      // Handled in context
    }
  };

  if (initialLoading) {
    return (
      <div className="py-20">
        <Loader size="medium" message="Retrieving task records..." />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6" id="edit-task-container">
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

      {/* Card Form container */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-normal text-white font-serif">
            Modify Task Records
          </h2>
          <p className="mt-1.5 text-xs text-zinc-500 font-sans">
            Adjust execution scope, task prioritizations, or schedule dates.
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
              placeholder="e.g., Update system security"
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
              placeholder="Provide a comprehensive breakdown of requirements..."
              rows={4}
              className="w-full p-3 bg-zinc-950/60 border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600 text-sm font-sans rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-1 transition-all resize-y min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
                className="w-full h-10 px-3 bg-zinc-950/60 border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600 text-sm font-sans rounded-xl text-white focus:outline-none focus:ring-1 transition-all cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full h-10 px-3 bg-zinc-950/60 border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600 text-sm font-sans rounded-xl text-white focus:outline-none focus:ring-1 transition-all cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950/60 border border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600 text-sm font-sans rounded-xl text-white focus:outline-none focus:ring-1 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Actions */}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
export { EditTask };
