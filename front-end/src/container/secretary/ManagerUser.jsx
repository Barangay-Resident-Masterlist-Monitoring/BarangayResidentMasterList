import { useState, useEffect, useRef } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';
import styles from '../css/login.module.css';

const ManageUser = () => {
  const { fireSuccess, fireError, fireConfirm } = useSweetAlert();

  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('users') || localStorage.getItem('resident');
    return stored ? JSON.parse(stored) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    occupation: '',
    contactNumber: '',
    role: 'Secretary',
    photo: null,
    photoURL: '',
  });

  const getMaxBirthdate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    return today.toISOString().split('T')[0];
  };

  const hasLoaded = useRef(false);

  useEffect(() => {
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const generateId = () => Math.floor(Math.random() * 100000);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const openModal = (user = null) => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData({
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        sex: '',
        birthdate: '',
        civilStatus: '',
        occupation: '',
        contactNumber: '',
        role: '',
        photo: null,
        photoURL: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      if (file) {
        const photoURL = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, photo: file, photoURL }));
      }
    } else if (name === 'birthdate') {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, birthdate: value, age }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      id,
      firstName,
      middleName,
      lastName,
      age,
      sex,
      birthdate,
      civilStatus,
      occupation,
      contactNumber,
      photo,
      photoURL,
      role,
    } = formData;

    if (
      !firstName.trim() ||
      !middleName.trim() ||
      !lastName.trim() ||
      !age ||
      !sex ||
      !birthdate ||
      !civilStatus.trim() ||
      !occupation.trim() ||
      !contactNumber.trim() ||
      (!photo && !photoURL)
    ) {
      fireError('Oops...', 'Please fill all fields and upload a photo.');
      return;
    }

    if (id) {
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...formData } : user))
      );
      fireSuccess('Updated!', 'User updated.');
    } else {
      const newUser = {
        ...formData,
        id: generateId(),
      };
      setUsers((prev) => [...prev, newUser]);
      fireSuccess('Added!', 'New user added.');
    }

    setShowModal(false);
  };

  const handleDelete = (userId) => {
    fireConfirm('Are you sure?', 'This will remove the user.').then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        fireSuccess('Deleted', 'User removed.');
      }
    });
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      (user.age && user.age.toString().includes(search)) ||
      (user.sex && user.sex.toLowerCase().includes(search)) ||
      (user.birthdate && user.birthdate.toLowerCase().includes(search)) ||
      (user.civilStatus && user.civilStatus.toLowerCase().includes(search)) ||
      (user.occupation && user.occupation.toLowerCase().includes(search)) ||
      (user.contactNumber && user.contactNumber.toLowerCase().includes(search)) ||
      (user.role && user.role.toLowerCase().includes(search))
    );
  });

  const occupationOptions = [
    'Student',
    'Employed',
    'Self-Employed',
    'Unemployed',
    'Retired',
    'Other',
  ];

  return (
    <div className={`container h-100 my-5 ${styles.bg}`}>
      <h2 className={`mb-4 ${styles['forest-green-text']}`}>Manage Residents and Officials</h2>

      <div className="d-flex gap-5 justify-content-between align-items-center mb-3">
        <button className={`btn ${styles['forest-green']}`} onClick={() => openModal()}>
          + Add New Residents/Officials
        </button>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '300px' }}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className={`${styles['forest-green']} text-white`}>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Birthdate</th>
              <th>Civil Status</th>
              <th>Occupation</th>
              <th>Contact Number</th>
              <th>Role</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={user.id + '-' + idx}>
                  <td>{user.id}</td>
                  <td>{`${user.firstName} ${user.middleName} ${user.lastName}`}</td>
                  <td>{user.age}</td>
                  <td>{user.sex}</td>
                  <td>{user.birthdate}</td>
                  <td>{user.civilStatus}</td>
                  <td>{user.occupation}</td>
                  <td>{user.contactNumber}</td>
                  <td>{user.role}</td>
                  <td className="text-center">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User"
                        className="img-thumbnail"
                        style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      'No photo'
                    )}
                  </td>
                  <td>
                    <a
                      href="#"
                      className="btn btn-sm btn-link text-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setViewPhoto(user);
                      }}
                      style={{ textDecoration: 'underline' }}
                    >
                      View Photo
                    </a>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => openModal(user)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className={`modal-header ${styles['forest-green']}`}>
                  <h5 className="modal-title text-white">{formData.id ? 'Edit User' : 'Add User'}</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName ?? ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Middle Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="middleName"
                      value={formData.middleName ?? ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName ?? ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Birthdate</label>
                    <input
                      type="date"
                      className="form-control"
                      name="birthdate"
                      value={formData.birthdate <= 0 ? 'Age': `${formData.birthdate} year/s old`}
                      onChange={handleChange}
                      required
                      max={getMaxBirthdate()}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      min="0"
                      max="120"
                      value={formData.age ?? ''}
                      onChange={handleChange}
                      required
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sex</label>
                    <select
                      className="form-select"
                      name="sex"
                      value={formData.sex ?? ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Civil Status</label>
                    <select
                      className="form-select"
                      name="civilStatus"
                      value={formData.civilStatus ?? ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Occupation</label>
                    <select
                      className="form-select"
                      name="occupation"
                      value={occupationOptions.includes(formData.occupation) ? formData.occupation : 'Other'}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value !== 'Other') {
                          setFormData((prev) => ({ ...prev, occupation: value }));
                        } else {
                          setFormData((prev) => ({ ...prev, occupation: '' }));
                        }
                      }}
                      required
                    >
                      <option value="">Select occupation</option>
                      {occupationOptions.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                    {(!occupationOptions.includes(formData.occupation) || formData.occupation === '') && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Please specify occupation"
                        value={!occupationOptions.includes(formData.occupation) ? formData.occupation : ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, occupation: e.target.value }))
                        }
                        required
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      placeholder="+639xxxxxxxxx"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role ?? ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="Secretary">Secretary</option>
                      <option value="Resident">Resident</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Photo</label>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      className="form-control"
                      onChange={handleChange}
                    />
                    {formData.photoURL && (
                      <img
                        src={formData.photoURL}
                        alt="Preview"
                        className="mt-2 img-thumbnail"
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {formData.id ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {viewPhoto && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setViewPhoto(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">
                  {viewPhoto.firstName} {viewPhoto.middleName} {viewPhoto.lastName}'s Photo
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewPhoto(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {viewPhoto.photoURL ? (
                  <img
                    src={viewPhoto.photoURL}
                    alt={`${viewPhoto.firstName} ${viewPhoto.lastName}`}
                    style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
                  />
                ) : (
                  <p>No photo available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
