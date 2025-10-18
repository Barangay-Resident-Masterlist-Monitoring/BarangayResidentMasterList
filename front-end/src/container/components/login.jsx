import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import loginCSS from '../css/login.module.css';
import useSweetAlert from '../hooks/useSweetAlert';

const login = ({ currentUserType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { fireSuccess, fireError } = useSweetAlert();

  const userType = currentUserType.toLowerCase();


  const authenticate = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(
      (user) =>
        user.email === email &&
        user.password === password 
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType === 'resident' || userType === 'secretary') {
      const isAuthenticated = authenticate(email, password, userType);

      if (isAuthenticated) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(
          (user) =>
            user.email === email 
        );

        if (currentUser) {
          localStorage.setItem('CurrentUserId', currentUser.id);
        }

        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('email', email);

        fireSuccess('Login successful! Redirecting...');
        navigate(`/${userType}/dashboard`);
      } else {
        fireError('Invalid credentials or incorrect role. Please try again.');
      }
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center min-vh-100 px-3 ${loginCSS.bg}`}>
      <div className={`card shadow p-4 w-100`} style={{ maxWidth: '400px' }}>
        <h3 className={`text-center mb-4 ${loginCSS['forest-green-text']}`}>
          <strong>{currentUserType} Login</strong>
        </h3>

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
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
            <div className="form-check mb-2 mb-sm-0">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="/forgot-password" className={`text-decoration-none ${loginCSS['forest-green-text']}`}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={`btn w-100 ${loginCSS['forest-green']}`}>
            Login
          </button>

          <div className="mt-3 text-center">
            <a href="/register" className={`text-decoration-none ${loginCSS['forest-green-text']}`}>
              <span className="text-black">Don't have an account?</span> Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default login;
