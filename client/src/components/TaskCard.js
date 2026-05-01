function TaskCard({ task, canUpdateStatus, onStatusChange, isUpdatingStatus }) {
  const assignedUser = task.assignedTo;
  const assignedUserName = typeof assignedUser === 'string'
    ? assignedUser
    : assignedUser?.name || assignedUser?.email || 'Not assigned';
  const projectTitle = task.projectId?.title || 'Project unavailable';

  return (
    <article className="card">
      <div className="card-header">
        <h3>{task.title}</h3>
        <span className="badge">{task.status}</span>
      </div>
      <p>{task.description}</p>
      <p className="muted">Project: {projectTitle}</p>
      <p className="muted">Assigned to: {assignedUserName}</p>
      {task.dueDate && (
        <p className="muted">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      )}
      {canUpdateStatus && (
        <label className="status-field">
          Update Status
          <select
            value={task.status}
            disabled={isUpdatingStatus}
            onChange={(event) => onStatusChange(task._id || task.id, event.target.value)}
          >
            <option value="todo">todo</option>
            <option value="in-progress">in-progress</option>
            <option value="done">done</option>
          </select>
          {isUpdatingStatus && <span className="muted">Updating...</span>}
        </label>
      )}
    </article>
  );
}

export default TaskCard;
