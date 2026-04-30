const Task = require('../models/Task');

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}

async function canUpdateTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isAssignedUser = task.assignedTo.toString() === req.user._id.toString();

    // Admins can update any task. Members can update only their assigned task.
    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({ message: 'You can only update your assigned tasks' });
    }

    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Unable to check task access' });
  }
}

module.exports = {
  adminOnly,
  canUpdateTask,
};
