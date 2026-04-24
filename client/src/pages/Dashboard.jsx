// client/src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { fetchTasks, createTask, deleteTask } from '../api/tasks';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // ─── Load tasks on mount ────────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setFetchError('Failed to load tasks. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ─── Add task — optimistic UI: prepend immediately ──────────────────────────
  const handleAddTask = async (taskData) => {
    const newTask = await createTask(taskData); // throws on error (caught in TaskForm)
    setTasks((prev) => [newTask, ...prev]);
  };

  // ─── Delete task — optimistic UI: remove immediately ───────────────────────
  const handleDeleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await deleteTask(id);
    } catch {
      // Rollback: re-fetch if deletion failed
      loadTasks();
    }
  };

  // ─── Skeleton placeholder for loading state ─────────────────────────────────
  const SkeletonCard = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
      <div className="w-5 h-5 rounded-full bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-slate-900">
            Good {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading
              ? 'Loading your tasks…'
              : tasks.length === 0
              ? 'You have no tasks yet. Add one below.'
              : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} · ${completedCount} done`}
          </p>
        </div>

        {/* Add task form */}
        <div className="animate-slide-up">
          <TaskForm onAdd={handleAddTask} />
        </div>

        {/* Fetch error */}
        {fetchError && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fetchError}
            <button onClick={loadTasks} className="ml-auto text-red-600 hover:text-red-700 underline underline-offset-2 font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Task list */}
        <div className="mt-5 space-y-2.5">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : tasks.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16 animate-fade-in">
              <div className="text-4xl mb-3 select-none">📋</div>
              <p className="text-slate-600 font-medium">No tasks yet</p>
              <p className="text-slate-400 text-sm mt-1">Add your first task above to get started</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDeleteTask} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

// Returns "morning", "afternoon", or "evening" based on local time
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

export default Dashboard;
