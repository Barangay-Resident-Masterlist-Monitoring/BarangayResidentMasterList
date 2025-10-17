import { useState, useEffect } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';
import loginCSS from '../css/login.module.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);

  const { fireSuccess, fireError } = useSweetAlert();
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  useEffect(() => {
    if (otpVerified) {
      setShowResetForm(true);
    }
  }, [otpVerified]);

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendResetEmail = () => {
    if (!email.trim()) {
      fireError('Email is required.');
      return;
    }

    if (!isValidEmail(email)) {
      fireError('Please enter a valid email address.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((user) => user.email === email);

    if (!userExists) {
      fireError('Email not found in our system.');
      return;
    }

    const otp = generateOTP();
    setGeneratedOTP(otp);
    setResetLinkSent(true);
    setOtpSentTime(Date.now());

    fireSuccess(`Your OTP is: ${otp} (valid for 15 minutes)`); // DIY: Show OTP in alert
  };

  const verifyOTP = () => {
    const now = Date.now();
    if (!otpSentTime || now - otpSentTime > 15 * 60 * 1000) {
      fireError('OTP expired. Please request a new one.');
      return;
    }

    if (otpInput.trim() === generatedOTP) {
      setOtpVerified(true);
      fireSuccess('OTP verified! You can now reset your password.');
    } else {
      fireError('Invalid OTP. Please try again.');
    }
  };

  const updatePassword = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      fireError('Password fields cannot be empty.');
      return;
    }

    if (newPassword !== confirmPassword) {
      fireError('Passwords do not match.');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      fireError('Email not found.');
      return;
    }

    users[userIndex].password = newPassword;
    users[userIndex].confirmPassword = confirmPassword;
    localStorage.setItem('users', JSON.stringify(users));

    fireSuccess('Password updated successfully! Redirecting to login...');

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  // --- UI RENDERING ---

  if (showResetForm && otpVerified) {
    return (
      <div className={`d-flex justify-content-center align-items-center min-vh-100 px-3 ${loginCSS.bg}`}>
        <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
          <h3 className={`text-center mb-4 ${loginCSS['forest-green-text']}`}>Reset Password</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePassword();
            }}
          >
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" value={email} readOnly />
            </div>
            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={`btn w-100 ${loginCSS['forest-green']}`}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (resetLinkSent && !otpVerified) {
    return (
      <div className={`d-flex justify-content-center align-items-center min-vh-100 px-3 ${loginCSS.bg}`}>
        <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
          <h3 className={`text-center mb-4 ${loginCSS['forest-green-text']}`}>Enter OTP</h3>
          <p className="text-muted text-center">Check the OTP shown in the popup.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyOTP();
            }}
          >
            <div className="mb-3">
              <label>OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the 6-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                required
                maxLength={6}
              />
            </div>
            <button type="submit" className={`btn w-100 ${loginCSS['forest-green']}`}>
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`d-flex justify-content-center align-items-center min-vh-100 px-3 ${loginCSS.bg}`}>
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <h3 className={`text-center mb-4 ${loginCSS['forest-green-text']}`}>Forgot Password</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendResetEmail();
          }}
        >
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={resetLinkSent}
            />
          </div>
          <button type="submit" disabled={resetLinkSent} className={`btn w-100 ${loginCSS['forest-green']}`}>
            {resetLinkSent ? 'OTP Sent' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
