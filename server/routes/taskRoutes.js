const express = require('express');
const {
  createTask,
  getTasks,
  getTasksByProject,
  updateTaskStatus,
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const { adminOnly, canUpdateTask } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, adminOnly, createTask);
router.get('/', protect, getTasks);
router.get('/project/:projectId', protect, getTasksByProject);
router.put('/:taskId/status', protect, canUpdateTask, updateTaskStatus);
router.patch('/:taskId/status', protect, canUpdateTask, updateTaskStatus);

module.exports = router;
