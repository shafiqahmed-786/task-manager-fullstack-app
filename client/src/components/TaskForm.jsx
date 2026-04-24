// client/src/components/TaskForm.jsx
// Inline form for adding new tasks — expands to show description field on focus

import { useState, useRef } from 'react';

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setLoading(true);
    setError('');

    try {
      await onAdd({ title: trimmedTitle, description: description.trim() });
      // Reset form on success
      setTitle('');
      setDescription('');
      setExpanded(false);
      titleRef.current?.focus();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setExpanded(false);
    setError('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <form onSubmit={handleSubmit}>
        {/* Title row */}
        <div className="flex items-center gap-2 px-4 py-3">
          {/* Plus icon */}
          <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>

          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }}
            onFocus={() => setExpanded(true)}
            placeholder="Add a new task…"
            className="flex-1 text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none"
          />

          {title.trim() && (
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding
                </span>
              ) : (
                'Add'
              )}
            </button>
          )}
        </div>

        {/* Expanded: description field + footer */}
        {expanded && (
          <div className="border-t border-slate-100 animate-fade-in">
            <div className="px-4 py-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)…"
                rows={2}
                className="w-full text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none resize-none"
              />
            </div>

            {error && (
              <div className="mx-4 mb-3 p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs">
                {error}
              </div>
            )}

            <div className="px-4 pb-3 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
