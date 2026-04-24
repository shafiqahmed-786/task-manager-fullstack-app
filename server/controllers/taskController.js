// server/controllers/taskController.js
// Handles task CRUD operations — all routes are user-scoped

const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all tasks belonging to the authenticated user
// @route   GET /api/tasks
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('[getTasks]', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new task for the authenticated user
// @route   POST /api/tasks
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { title, description } = req.body;

  try {
    const task = await Task.create({
      title,
      description: description || '',
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('[createTask]', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ownership check: ensure the task belongs to the requesting user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('[deleteTask]', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = { getTasks, createTask, deleteTask };
