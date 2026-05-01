function formatMember(member) {
  if (typeof member === 'string') {
    return member;
  }

  return member.name || member.email || member._id || member.id;
}

function ProjectCard({
  project,
  isAdmin,
  memberId,
  availableUsers,
  onMemberIdChange,
  onAddMember,
  isAddingMember,
}) {
  const projectId = project._id || project.id;
  const members = project.members || [];

  return (
    <article className="card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>

      <p className="muted">
        Admin: {project.admin?.name || project.admin?.email || 'Not available'}
      </p>

      <p className="muted">
        Members: {members.length > 0 ? members.map(formatMember).join(', ') : 'No members'}
      </p>

      {isAdmin && (
        <form className="member-form" onSubmit={(event) => onAddMember(event, projectId)}>
          <label className="status-field">
            Add Member
            <select
              value={memberId || ''}
              onChange={(event) => onMemberIdChange(projectId, event.target.value)}
            >
              <option value="">Select member</option>
              {availableUsers.map((user) => (
                <option key={user._id || user.id} value={user._id || user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={isAddingMember}>
            {isAddingMember ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      )}
    </article>
  );
}

export default ProjectCard;
