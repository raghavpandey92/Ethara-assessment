const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');

function buildDashboardQuery(user) {
  if (user.role === 'admin') {
    return {};
  }

  return { assignedTo: user._id };
}

const getDashboard = asyncHandler(async (req, res) => {
  const query = buildDashboardQuery(req.user);
  const tasks = await Task.find(query).populate('assignedTo', 'name email role');
  const today = new Date();

  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === 'todo').length,
    'in-progress': tasks.filter((task) => task.status === 'in-progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  };

  const tasksPerUser = {};

  tasks.forEach((task) => {
    const userName = task.assignedTo?.name || task.assignedTo?.email || 'Unassigned';
    tasksPerUser[userName] = (tasksPerUser[userName] || 0) + 1;
  });

  const overdueTasks = tasks.filter((task) => {
    return task.status !== 'done' && task.dueDate < today;
  });

  res.json({
    totalTasks: tasks.length,
    tasksByStatus,
    tasksPerUser,
    overdueTasks,
  });
});

module.exports = {
  getDashboard,
};
