const Project = require('../models/Project');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function isProjectAdmin(project, userId) {
  return project.admin.toString() === userId.toString();
}

function populateProject(projectId) {
  return Project.findById(projectId)
    .populate('admin', 'name email role')
    .populate('members', 'name email role');
}

const createProject = asyncHandler(async (req, res) => {
  const { title, name, description, members } = req.body;
  const projectTitle = title || name;

  if (!projectTitle || !description) {
    throw new AppError('Title and description are required', 400);
  }

  const createdProject = await Project.create({
    title: projectTitle,
    description,
    admin: req.user._id,
    members: members || [],
  });
  const project = await populateProject(createdProject._id);

  res.status(201).json(project);
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [
      { admin: req.user._id },
      { members: req.user._id },
    ],
  })
    .populate('admin', 'name email role')
    .populate('members', 'name email role');

  res.json(projects);
});

const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberId } = req.body;

  if (!memberId) {
    throw new AppError('Member id is required', 400);
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!isProjectAdmin(project, req.user._id)) {
    throw new AppError('Only project admin can add members', 403);
  }

  const isAlreadyMember = project.members.some((id) => id.toString() === memberId);

  if (!isAlreadyMember) {
    project.members.push(memberId);
    await project.save();
  }

  res.json(await populateProject(project._id));
});

const removeMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!isProjectAdmin(project, req.user._id)) {
    throw new AppError('Only project admin can remove members', 403);
  }

  project.members = project.members.filter((id) => id.toString() !== memberId);
  await project.save();

  res.json(await populateProject(project._id));
});

module.exports = {
  createProject,
  getProjects,
  addMember,
  removeMember,
};
