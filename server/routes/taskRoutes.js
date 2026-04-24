// server/routes/taskRoutes.js
// Task CRUD route definitions — all routes protected by JWT middleware

const express = require('express');
const { body } = require('express-validator');
const { getTasks, createTask, deleteTask } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Apply JWT protection to every task route
router.use(protect);

// ─── Validation ───────────────────────────────────────────────────────────────

const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get('/', getTasks);
router.post('/', taskValidation, createTask);
router.delete('/:id', deleteTask);

module.exports = router;
