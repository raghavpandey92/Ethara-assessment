import { useEffect, useState } from 'react';
import { addProjectMember, createProject, getProjects } from '../api/projectApi';
import { getUsers } from '../api/userApi';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { getApiError, getItemFromResponse, getListFromResponse } from '../utils/apiHelpers';

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [addingMemberProjectId, setAddingMemberProjectId] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    async function fetchProjects() {
      try {
        setError('');
        setIsLoading(true);
        const response = await getProjects();
        setProjects(getListFromResponse(response.data, 'projects'));
      } catch (apiError) {
        setError(getApiError(apiError, 'Unable to load projects.'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      if (!isAdmin) {
        return;
      }

      try {
        const response = await getUsers();
        setUsers(getListFromResponse(response.data, 'users'));
      } catch (apiError) {
        setError(getApiError(apiError, 'Unable to load users.'));
      }
    }

    fetchUsers();
  }, [isAdmin]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Please enter project title and description.');
      return;
    }

    try {
      setError('');
      setIsSaving(true);
      const response = await createProject({
        title: title.trim(),
        description: description.trim(),
      });
      const newProject = getItemFromResponse(response.data, 'project');

      setProjects([newProject, ...projects]);
      resetForm();
      setError('');
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to create project.'));
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setTitle('');
    setDescription('');
  }

  function handleMemberIdChange(projectId, memberId) {
    setMemberIds({
      ...memberIds,
      [projectId]: memberId,
    });
  }

  async function handleAddMember(event, projectId) {
    event.preventDefault();

    const memberId = memberIds[projectId]?.trim();

    if (!memberId) {
      setError('Please select a member.');
      return;
    }

    try {
      setError('');
      setAddingMemberProjectId(projectId);
      const response = await addProjectMember(projectId, memberId);
      const updatedProject = getItemFromResponse(response.data, 'project');

      setProjects(projects.map((project) => {
        const currentProjectId = project._id || project.id;

        return currentProjectId === projectId ? updatedProject : project;
      }));

      setMemberIds({
        ...memberIds,
        [projectId]: '',
      });
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to add member.'));
    } finally {
      setAddingMemberProjectId('');
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Projects</h1>
        <p>Track all team projects in one place. Role: {user?.role}.</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isAdmin && (
        <form className="form-card project-form" onSubmit={handleSubmit}>
          <h2>Create Project</h2>
          <label>
            Project Name
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Project name"
              required
            />
          </label>
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Project description"
              required
            />
          </label>
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      )}

      <h2>Project List</h2>
      {isLoading ? (
        <p className="muted">Loading...</p>
      ) : (
        <div className="grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id || project.id}
              project={project}
              isAdmin={isAdmin}
              memberId={memberIds[project._id || project.id]}
              availableUsers={users.filter((currentUser) => currentUser.role === 'member')}
              onMemberIdChange={handleMemberIdChange}
              onAddMember={handleAddMember}
              isAddingMember={addingMemberProjectId === (project._id || project.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;
