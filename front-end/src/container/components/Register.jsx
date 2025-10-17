import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginCSS from '../css/login.module.css';
import useSweetAlert from '../hooks/useSweetAlert';

const Register = () => {
  const navigate = useNavigate();
  const { fireSuccess, fireError } = useSweetAlert();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    photo: null,
    photoURL: null,
  });

  useEffect(() => {
    return () => {
      if (formData.photoURL) {
        URL.revokeObjectURL(formData.photoURL);
      }
    };
  }, [formData.photoURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      if (file) {
        if (formData.photoURL) {
          URL.revokeObjectURL(formData.photoURL);
        }
        const photoURL = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          photo: file,
          photoURL: photoURL,
        }));
      }
    }
  };

  const generateNumericId = () => {
    const lastId = parseInt(localStorage.getItem('lastUserId') || '0', 10);
    const newId = lastId + 1;
    localStorage.setItem('lastUserId', newId);
    return newId;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      fireError('error', 'Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some(user => user.email === formData.email);

    if (userExists) {
      fireError('error', 'Email already registered!');
      return;
    }

    const newUser = {
      id: generateNumericId(),
      ...formData,
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    fireSuccess('success', 'Registration successful!');
    navigate(`/${newUser.role}/login`);
  };

  return (
    <div className={`container-fluid d-flex justify-content-center align-items-md-center min-vh-100 px-3 ${loginCSS.bg}`} style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4 w-100 overflow-auto" style={{ maxWidth: '900px', paddingBottom: '2rem' }}>
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                className="form-control"
                value={formData.middleName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Retype Password"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Resident">Resident</option>
                <option value="Secretary">Secretary</option>
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="photo" className="form-label">Profile Picture</label>
              <input
                type="file"
                id="photo"
                name="photo"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.photoURL && (
                <img
                  src={formData.photoURL}
                  alt="Profile Preview"
                  className="mt-3"
                  style={{ maxWidth: '150px', maxHeight: '150px' }}
                />
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100 mt-4">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
