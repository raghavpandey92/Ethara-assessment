import { useEffect, useState } from 'react';
import { getProjects } from '../api/projectApi';
import { createTask, getTasks, updateTaskStatus } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { getApiError, getItemFromResponse, getListFromResponse } from '../utils/apiHelpers';

function getProjectUsers(project) {
  if (!project) {
    return [];
  }

  return [project.admin, ...(project.members || [])].filter(Boolean);
}

function getUserId(user) {
  return user?._id || user?.id || '';
}

function isTaskAssignedToUser(task, user) {
  return getUserId(task.assignedTo) === getUserId(user);
}

function Tasks() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [error, setError] = useState('');
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState('');
  const isAdmin = user?.role === 'admin';

  const selectedProject = projects.find((project) => {
    return (project._id || project.id) === projectId;
  });
  const projectUsers = getProjectUsers(selectedProject);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setError('');
        setIsProjectsLoading(true);
        const response = await getProjects();
        const projectList = getListFromResponse(response.data, 'projects');

        setProjects(projectList);

        if (projectList.length > 0) {
          const firstProject = projectList[0];
          const firstProjectId = projectList[0]._id || projectList[0].id;

          setProjectId(firstProjectId);
          setAssignedTo(getUserId(getProjectUsers(firstProject)[0]));
        }
      } catch (apiError) {
        setError(getApiError(apiError, 'Unable to load projects.'));
      } finally {
        setIsProjectsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setError('');
        setIsLoading(true);
        const response = await getTasks(projectId);
        setTasks(getListFromResponse(response.data, 'tasks'));
      } catch (apiError) {
        setError(getApiError(apiError, 'Unable to load tasks.'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, [projectId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !dueDate || !projectId || !assignedTo) {
      setError('Please fill in all task fields.');
      return;
    }

    try {
      setError('');
      setIsSaving(true);
      const response = await createTask({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        status,
        projectId,
        assignedTo,
      });
      const newTask = getItemFromResponse(response.data, 'task');

      setTasks([newTask, ...tasks]);
      resetForm();
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to create task.'));
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setStatus('todo');
    setAssignedTo(projectUsers[0] ? getUserId(projectUsers[0]) : '');
  }

  function handleProjectChange(newProjectId) {
    const project = projects.find((currentProject) => {
      return (currentProject._id || currentProject.id) === newProjectId;
    });
    const firstUser = getProjectUsers(project)[0];

    setProjectId(newProjectId);
    setAssignedTo(firstUser ? getUserId(firstUser) : '');
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      setError('');
      setUpdatingTaskId(taskId);
      const response = await updateTaskStatus(taskId, newStatus);
      const updatedTask = getItemFromResponse(response.data, 'task');

      setTasks(tasks.map((task) => {
        const currentTaskId = task._id || task.id;

        return currentTaskId === taskId ? updatedTask : task;
      }));
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to update task status.'));
    } finally {
      setUpdatingTaskId('');
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Tasks</h1>
        <p>See what everyone is working on. Role: {user?.role}.</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <label className="status-field">
        Project
        <select
          value={projectId}
          disabled={isProjectsLoading}
          onChange={(event) => handleProjectChange(event.target.value)}
        >
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project._id || project.id} value={project._id || project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </label>
      {isProjectsLoading && <p className="muted">Loading projects...</p>}

      {isAdmin && (
        <form className="form-card project-form" onSubmit={handleSubmit}>
          <h2>Create Task</h2>
          <label>
            Task Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              required
            />
          </label>
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Task description"
              required
            />
          </label>
          <label>
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              required
            />
          </label>
          <label>
            Assign User
            <select
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              required
            >
              <option value="">Select user</option>
              {projectUsers.map((projectUser) => (
                <option key={getUserId(projectUser)} value={getUserId(projectUser)}>
                  {projectUser.name || projectUser.email}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="todo">todo</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>
          </label>
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      )}

      <h2>Task List</h2>
      {isLoading ? (
        <p className="muted">Loading...</p>
      ) : (
        <div className="grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id || task.id}
              task={task}
              canUpdateStatus={isAdmin || isTaskAssignedToUser(task, user)}
              onStatusChange={handleStatusChange}
              isUpdatingStatus={updatingTaskId === (task._id || task.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Tasks;
