import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiHelpers';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function validateForm() {
    if (!email.trim() || !password.trim()) {
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
    setEmail('');
    setPassword('');
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
      const response = await loginUser({
        email: email.trim(),
        password,
      });
      const { token, user } = response.data;

      if (!token) {
        setError('Login failed. Token was not returned.');
        return;
      }

      // AuthContext stores the JWT in localStorage for future API requests.
      login(user, token);
      resetForm();
      navigate('/dashboard');
    } catch (apiError) {
      setError(getApiError(apiError, 'Login failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
        <p>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
