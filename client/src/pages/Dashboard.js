import { useEffect, useState } from 'react';
import { getDashboard } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiHelpers';

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
    totalTasks: 0,
    tasksByStatus: {},
    overdueTasks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setError('');
        setIsLoading(true);
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (apiError) {
        setError(getApiError(apiError, 'Unable to load dashboard.'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const todoTasks = dashboard.tasksByStatus.todo || 0;
  const inProgressTasks = dashboard.tasksByStatus['in-progress'] || 0;
  const doneTasks = dashboard.tasksByStatus.done || 0;

  if (isLoading) {
    return <p className="muted">Loading...</p>;
  }

  return (
    <section>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name || user?.email}.</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="stats-grid">
        <div className="stat-box">
          <strong>{dashboard.totalTasks}</strong>
          <span>Total Tasks</span>
        </div>
        <div className="stat-box">
          <strong>{dashboard.overdueTasks.length}</strong>
          <span>Overdue Tasks</span>
        </div>
      </div>

      <h2>Tasks by Status</h2>
      <div className="grid">
        <div className="card">
          <h3>Todo</h3>
          <strong className="status-count">{todoTasks}</strong>
        </div>
        <div className="card">
          <h3>In Progress</h3>
          <strong className="status-count">{inProgressTasks}</strong>
        </div>
        <div className="card">
          <h3>Done</h3>
          <strong className="status-count">{doneTasks}</strong>
        </div>
      </div>

      <h2>Overdue Tasks</h2>
      <div className="card">
        {dashboard.overdueTasks.length > 0 ? (
          <ul className="task-list">
            {dashboard.overdueTasks.map((task) => (
              <li key={task._id || task.id}>
                <span>{task.title}</span>
                <span className="muted">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No overdue tasks.</p>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
