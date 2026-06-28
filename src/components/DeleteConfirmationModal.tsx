import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-150 dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content layout */}
            <div className="flex gap-4 items-start mt-1">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex-shrink-0 flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 font-sans">
                  Delete Task?
                </h3>
                <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400 font-sans leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-zinc-900 dark:text-zinc-200">"{taskTitle}"</strong>? This action is absolute and cannot be undone.
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 h-9 border border-zinc-350 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 h-9 bg-rose-650 hover:bg-rose-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Delete Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
