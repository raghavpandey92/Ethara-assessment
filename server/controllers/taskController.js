const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const VALID_TASK_STATUSES = ['todo', 'in-progress', 'done'];

function buildTaskQuery(user, projectId) {
  const query = {};

  if (projectId) {
    query.projectId = projectId;
  }

  if (user.role !== 'admin') {
    query.assignedTo = user._id;
  }

  return query;
}

function findTasks(query) {
  return Task.find(query)
    .populate('assignedTo', 'name email role')
    .populate('projectId', 'title description');
}

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status, projectId, assignedTo } = req.body;

  if (!title || !description || !dueDate || !projectId || !assignedTo) {
    throw new AppError('Please fill in all required fields', 400);
  }

  const createdTask = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    projectId,
    assignedTo,
  });
  const task = await Task.findById(createdTask._id)
    .populate('assignedTo', 'name email role')
    .populate('projectId', 'title description');

  res.status(201).json(task);
});

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  const tasks = await findTasks(buildTaskQuery(req.user, projectId));

  res.json(tasks);
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const tasks = await findTasks(buildTaskQuery(req.user, projectId));

  res.json(tasks);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!VALID_TASK_STATUSES.includes(status)) {
    throw new AppError('Invalid task status', 400);
  }

  const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true })
    .populate('assignedTo', 'name email role')
    .populate('projectId', 'title description');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json(task);
});

module.exports = {
  createTask,
  getTasks,
  getTasksByProject,
  updateTaskStatus,
};
