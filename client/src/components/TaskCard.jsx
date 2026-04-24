// client/src/components/TaskCard.jsx
// Displays a single task with title, optional description, date, and delete button

import { useState } from 'react';

const TaskCard = ({ task, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id); // Parent handles error/rollback
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`group bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 transition-all duration-200 hover:border-slate-300 hover:shadow-sm animate-slide-up ${
        deleting ? 'opacity-40 scale-95' : ''
      }`}
    >
      {/* Circle indicator */}
      <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-indigo-300 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 leading-snug">{task.title}</p>
        {task.description && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
        <p className="text-xs text-slate-300 mt-1.5 font-mono">{formattedDate}</p>
      </div>

      {/* Delete button — visible on hover */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Delete task"
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all disabled:cursor-not-allowed"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TaskCard;
