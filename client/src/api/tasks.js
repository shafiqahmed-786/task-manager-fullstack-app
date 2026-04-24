// client/src/api/tasks.js
// Task-specific API calls

import api from './axios';

/**
 * Fetch all tasks for the authenticated user.
 * @returns {Promise<Task[]>}
 */
export const fetchTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

/**
 * Create a new task.
 * @param {{ title: string, description?: string }} taskData
 * @returns {Promise<Task>}
 */
export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

/**
 * Delete a task by ID.
 * @param {string} id - MongoDB ObjectId
 * @returns {Promise<{ message: string, id: string }>}
 */
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};
