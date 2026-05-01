import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiHelpers';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function validateForm() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return 'Please fill in all fields.';
    }

    if (!email.includes('@')) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    return '';
  }

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setRole('member');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      const response = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      const { token, user } = response.data;

      if (!token) {
        setError('Signup failed. Token was not returned.');
        return;
      }

      // AuthContext stores the JWT in localStorage for future API requests.
      signup(user, token);
      resetForm();
      navigate('/dashboard');
    } catch (apiError) {
      setError(getApiError(apiError, 'Signup failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        {error && <p className="error-message">{error}</p>}
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Signup'}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;
