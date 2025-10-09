import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import loginCSS from '../css/login.module.css';

const Login = ({ currentUserType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userType = currentUserType.toLowerCase();

  const authenticate = (email, password) => {
    return email.trim() !== '' && password.trim() !== '';
  };

  const generateNumericId = () => {
    // Optional: auto-increment from previous session IDs
    const lastId = parseInt(localStorage.getItem('lastSessionId') || '0', 10);
    const newId = lastId + 1;
    localStorage.setItem('lastSessionId', newId);
    return newId;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (userType === 'resident' || userType === 'secretary') {
      const isAuthenticated = authenticate(email, password);

      if (isAuthenticated) {
        const sessionId = generateNumericId(); // generate numerical ID
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('sessionId', sessionId); // store numerical ID
        navigate(`/${userType}/dashboard`);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center min-vh-100 ${loginCSS.bg}`}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className={`text-center mb-4 ${loginCSS['forest-green-text']}`}>
          <strong>{currentUserType} Login</strong>
        </h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <div className="input-group">
              <span className={`input-group-text ${loginCSS['forest-green']}`}>
                <FaUser />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className={`input-group-text ${loginCSS['forest-green']}`}>
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" className={`text-decoration-none ${loginCSS['forest-green-text']}`}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={`btn w-100 ${loginCSS['forest-green']}`}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
